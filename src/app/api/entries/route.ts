import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

const MAX_HOURS_PER_DAY = 24;

/**
 /api/entries
 */
export async function GET() {
    try {
        const entries = await prisma.timeEntry.findMany({
            orderBy: { date: 'desc' },
        });

        return NextResponse.json(entries);
    } catch (error) {
        console.error('Fetch error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'FETCH_FAILED',
                message: 'Помилка отримання даних',
            },
            { status: 500 }
        );
    }
}


/* /api/entries */

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { date, project, hours, description } = body;


        if (!date || !project || !hours || !description) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: 'Всі поля мають бути заповнені',
                },
                { status: 400 }
            );
        }


        const hoursNum = parseFloat(hours);
        if (isNaN(hoursNum) || hoursNum <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_HOURS',
                    message: 'Кількість годин має бути більше 0',
                },
                { status: 400 }
            );
        }


        const targetDate = new Date(date);

        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);


        const existingEntries = await prisma.timeEntry.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        const currentTotal = existingEntries.reduce(
            (sum, entry) => sum + entry.hours,
            0
        );


        if (currentTotal + hoursNum > MAX_HOURS_PER_DAY) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'HOURS_LIMIT_EXCEEDED',
                    message: 'Перевищено денний ліміт годин',
                    details: {
                        used: currentTotal,
                        remaining: MAX_HOURS_PER_DAY - currentTotal,
                        max: MAX_HOURS_PER_DAY,
                    },
                },
                { status: 409 }
            );
        }


        const newEntry = await prisma.timeEntry.create({
            data: {
                date: targetDate,
                project,
                hours: hoursNum,
                description,
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: newEntry,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'SERVER_ERROR',
                message: 'Помилка сервера',
            },
            { status: 500 }
        );
    }
}