import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function isAdmin(req: NextRequest) {
  const payload = await getRequestUser(req);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user?.isAdmin ? user : null;
}

function startOf(unit: 'day' | 'week' | 'month' | 'year') {
  const d = new Date();
  if (unit === 'day') { d.setHours(0, 0, 0, 0); }
  else if (unit === 'week') { const day = d.getDay(); d.setDate(d.getDate() - day); d.setHours(0, 0, 0, 0); }
  else if (unit === 'month') { d.setDate(1); d.setHours(0, 0, 0, 0); }
  else if (unit === 'year') { d.setMonth(0, 1); d.setHours(0, 0, 0, 0); }
  return d;
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(req: NextRequest) {
  const admin = await isAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const revenueMap: Record<string, number> = { basic: 9.99, pro: 24.99, premium: 35.99 };

  const todayStart = startOf('day');
  const yesterdayStart = yesterday();
  const weekStart = startOf('week');
  const monthStart = startOf('month');
  const yearStart = startOf('year');

  const [
    totalUsers, totalResumes, totalATS, subscriptions,
    usersToday, usersYesterday, usersWeek, usersMonth, usersYear,
    resumesToday, resumesYesterday, resumesWeek, resumesMonth, resumesYear,
    atsToday, atsYesterday, atsWeek, atsMonth, atsYear,
    planCounts,
    // Last 7 days daily signups for chart
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.resumeHistory.count(),
    prisma.aTSHistory.count(),
    prisma.subscription.findMany({ where: { status: 'active' } }),

    // Users by period
    prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.user.count({ where: { createdAt: { gte: yesterdayStart, lt: todayStart } } }),
    prisma.user.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.user.count({ where: { createdAt: { gte: yearStart } } }),

    // Resumes by period
    prisma.resumeHistory.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.resumeHistory.count({ where: { createdAt: { gte: yesterdayStart, lt: todayStart } } }),
    prisma.resumeHistory.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.resumeHistory.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.resumeHistory.count({ where: { createdAt: { gte: yearStart } } }),

    // ATS by period
    prisma.aTSHistory.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.aTSHistory.count({ where: { createdAt: { gte: yesterdayStart, lt: todayStart } } }),
    prisma.aTSHistory.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.aTSHistory.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.aTSHistory.count({ where: { createdAt: { gte: yearStart } } }),

    prisma.user.groupBy({ by: ['plan'], _count: { plan: true } }),

    // Last 7 days of signups (for sparkline)
    prisma.user.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  const monthlyRevenue = subscriptions.reduce((sum, s) => sum + (revenueMap[s.plan] || 0), 0);
  const yearlyRevenue = monthlyRevenue * 12;

  // Build last-7-days daily signup counts
  const last7: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = recentUsers.filter((u) => u.createdAt.toISOString().slice(0, 10) === dateStr).length;
    last7.push({ date: dateStr, count });
  }

  return NextResponse.json({
    // Totals
    totalUsers,
    totalResumes,
    totalATS,
    activeSubscriptions: subscriptions.length,
    monthlyRevenue: monthlyRevenue.toFixed(2),
    yearlyRevenue: yearlyRevenue.toFixed(2),
    planBreakdown: planCounts.map((p) => ({ plan: p.plan, count: p._count.plan })),

    // Time-based
    periods: {
      today:     { users: usersToday,     resumes: resumesToday,     ats: atsToday },
      yesterday: { users: usersYesterday, resumes: resumesYesterday, ats: atsYesterday },
      week:      { users: usersWeek,      resumes: resumesWeek,      ats: atsWeek },
      month:     { users: usersMonth,     resumes: resumesMonth,     ats: atsMonth },
      year:      { users: usersYear,      resumes: resumesYear,      ats: atsYear },
    },

    // Sparkline data
    last7DaysSignups: last7,
  });
}
