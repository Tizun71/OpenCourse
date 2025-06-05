import { useEffect, useState } from "react";
import CategoryService from "@/services/Backend-api/category-service";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function CategorySelect({ value, onChange }: Props) {
  const [categories, setCategories] = useState<
    { id: number; categoryName: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await CategoryService.list();
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <select
      id="category"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="col-span-3 block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value={0}>-- Chọn danh mục --</option>
      {loading ? (
        <option value={0}>Đang tải...</option>
      ) : (
        categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.categoryName}
          </option>
        ))
      )}
    </select>
  );
}
