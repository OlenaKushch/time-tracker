"use client";
import styles from './EntryHistory.module.css';


interface Entry {
  id: string;
  date: string;
  project: string;
  hours: number;
  description: string;
}

export default function EntryHistory({ entries }: { entries: Entry[] }) {
  
  const groups: Record<string, { items: Entry[]; dailyTotal: number }> = {};

  entries.forEach((entry) => {
    const dateKey = new Date(entry.date).toISOString().split("T")[0];

    if (!groups[dateKey]) {
      groups[dateKey] = { items: [], dailyTotal: 0 };
    }

    groups[dateKey].items.push(entry);
    groups[dateKey].dailyTotal += entry.hours;
  });

  const groupedData = Object.entries(groups).sort((a, b) =>
    b[0].localeCompare(a[0])
  );

  
  const grandTotal = entries.reduce((sum, entry) => sum + entry.hours, 0);

  if (entries.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-[40px] border-2 border-dashed">
        Історія записів порожня. Додайте свій перший запис!
      </div>
    );
  }

  return (
   <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Entry History</h2>
        <div className={styles.grandTotal}>
          <span className={styles.grandTotalText}>
            Grand Total: {grandTotal}h
          </span>
        </div>
      </div>

      <div className={styles.list}>
        {groupedData.map(([date, data]) => (
          <div key={date} className={styles.dayBlock}>
            <div className={styles.dayHeader}>
              <span className={styles.date}>{date}</span>
              <span className={styles.dayTotal}>
                Total for day:{" "}
                <span className={styles.dayTotalValue}>
                  {data.dailyTotal}h
                </span>
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>Project</th>
                    <th className={styles.th}>Hours</th>
                    <th className={styles.th}>Description</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  {data.items.map((item) => (
                    <tr key={item.id} className={styles.row}>
                      <td className={styles.project}>{item.project}</td>
                      <td className={styles.hours}>{item.hours}h</td>
                      <td className={styles.description}>
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}