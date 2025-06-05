"use client";

import { useEffect, useState } from "react";
import { Edit, Filter, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import CategoryService from "@/services/Backend-api/category-service";
import { toast } from "sonner";
import { ICategory } from "@/interface";

interface Category {
  id: number;
  categoryName: string;
  description: string;
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    description: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.list();
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) => {
    const categoryName = category.categoryName || "";
    const lowerSearchTerm = searchTerm ? searchTerm.toLowerCase() : "";

    return categoryName.toLowerCase().includes(lowerSearchTerm);
  });

  const handleAddCategory = async () => {
    try {
      const payload: ICategory.CategoryCreationPayload = {
        categoryName: newCategory.categoryName,
        description: newCategory.description,
      };

      const res = await CategoryService.add(payload);
      const added = res.data;
      setCategories([...categories, added]);
      setNewCategory({ categoryName: "", description: "" });
      setIsAddDialogOpen(false);
      fetchCategories();
    } catch {
      toast.error("Failed to add category");
    }
  };

  const handleEditCategory = async () => {
    if (!currentCategory) return;

    try {
      const payload: ICategory.CategoryUpdatePayload = {
        id: currentCategory.id,
        categoryName: currentCategory.categoryName,
        description: currentCategory.description,
      };

      const res = await CategoryService.upd(payload);
      const updated = res.data;

      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      setIsEditDialogOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to update category");
      console.error("Failed to update category:", err);
    }
  };

  const handleDeleteCategory = async () => {
    if (!currentCategory) return;
    try {
      await fetch(`/api/categories/${currentCategory.id}`, {
        method: "DELETE",
      });
      setCategories((prev) => prev.filter((c) => c.id !== currentCategory.id));
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Quản lý danh mục</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm danh mục..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Lọc</span>
              </Button>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm danh mục
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Thêm danh mục mới</DialogTitle>
                  <DialogDescription>
                    Điền thông tin để tạo danh mục mới. Nhấn Lưu khi hoàn tất.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoryName" className="text-right">
                      Tên danh mục
                    </Label>
                    <Input
                      id="categoryName"
                      value={newCategory.categoryName}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          categoryName: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right">
                      Mô tả
                    </Label>
                    <Textarea
                      id="description"
                      value={newCategory.description}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button onClick={handleAddCategory}>Lưu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
                  <DialogDescription>
                    Chỉnh sửa thông tin danh mục. Nhấn Lưu khi hoàn tất.
                  </DialogDescription>
                </DialogHeader>
                {currentCategory && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-categoryName" className="text-right">
                        Tên danh mục
                      </Label>
                      <Input
                        id="edit-categoryName"
                        value={currentCategory.categoryName}
                        onChange={(e) =>
                          setCurrentCategory({
                            ...currentCategory,
                            categoryName: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="edit-description" className="text-right">
                        Mô tả
                      </Label>
                      <Textarea
                        id="edit-description"
                        value={currentCategory.description}
                        onChange={(e) =>
                          setCurrentCategory({
                            ...currentCategory,
                            description: e.target.value,
                          })
                        }
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button onClick={handleEditCategory}>Lưu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa danh mục này? Hành động này không
                    thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteCategory}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="mt-4">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle>Danh sách danh mục</CardTitle>
                <CardDescription>
                  Quản lý tất cả danh mục của hệ thống. Bạn có thể thêm, sửa,
                  xóa danh mục từ đây.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tên danh mục</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="text-right">Tùy chọn</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            Không tìm thấy danh mục nào.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCategories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell>{category.id}</TableCell>
                            <TableCell className="font-medium">
                              {category.categoryName}
                            </TableCell>
                            <TableCell className="max-w-[400px]">
                              {category.description}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(category)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Sửa
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => openDeleteDialog(category)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
