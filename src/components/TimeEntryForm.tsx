"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./TimeEntryForm.module.css";

const PROJECTS = [
  "Viso Internal",
  "Client A",
  "Client B",
  "Personal Development",
];

type FormData = {
  date: string;
  project: string;
  hours: string;
  description: string;
};

type FormErrors = {
  date?: boolean;
  project?: boolean;
  hours?: boolean;
  description?: boolean;
};

export default function TimeEntryForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split("T")[0],
    project: PROJECTS[0],
    hours: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Frontend UX validation (required fields)
    const newErrors: FormErrors = {
      date: !formData.date,
      project: !formData.project,
      hours: !formData.hours,
      description: !formData.description,
    };

    const hasErrors = Object.values(newErrors).some(Boolean);

    if (hasErrors) {
      setErrors(newErrors);
      toast.error("Будь ласка, заповніть всі поля");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Щось пішло не так");
      }

      // success
      setFormData({
        ...formData,
        hours: "",
        description: "",
      });
      setErrors({});
      onSuccess();
      toast.success("Запис збережено!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Невідома помилка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Time Entry Form</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Date */}
        <div className={styles.field}>
          <label className={styles.label}>Date</label>
          <input
            type="date"
            className={`${styles.input} ${
              errors.date ? styles.errorInput : ""
            }`}
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />
        </div>

        {/* Project */}
        <div className={styles.field}>
          <label className={styles.label}>Project</label>
          <select
            className={`${styles.select} ${
              errors.project ? styles.errorInput : ""
            }`}
            value={formData.project}
            onChange={(e) =>
              setFormData({ ...formData, project: e.target.value })
            }
          >
            {PROJECTS.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>

        {/* Hours */}
        <div className={styles.field}>
          <label className={styles.label}>Hours</label>
          <input
            type="number"
            step="0.5"
            placeholder="Введіть кількість годин"
            className={`${styles.input} ${
              errors.hours ? styles.errorInput : ""
            }`}
            value={formData.hours}
            onChange={(e) =>
              setFormData({ ...formData, hours: e.target.value })
            }
          />
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label className={styles.label}>Work Description</label>
          <textarea
            placeholder="Опишіть вашу роботу"
            className={`${styles.textarea} ${
              errors.description ? styles.errorInput : ""
            }`}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Збереження..." : "Save"}
        </button>
      </form>
    </div>
  );
}
