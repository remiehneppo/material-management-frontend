import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout';
import { Button, Input, Select, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui';
import { useMaterials, useMaterialCategories } from '../hooks/use-materials';
import { ROUTES, PAGINATION, STATUS_COLORS } from '../constants';
import { formatDate } from '../utils/date';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';

const MaterialsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: materialsData, isLoading: isMaterialsLoading } = useMaterials({
    pagination: {
      page: currentPage,
      limit: PAGINATION.DEFAULT_LIMIT,
    },
    filters: {
      search: searchTerm,
      ...(selectedCategory && { categoryId: selectedCategory }),
    },
    sort: {
      field: 'name',
      order: 'asc',
    },
  });

  const { data: categoriesData } = useMaterialCategories();

  const materials = materialsData?.data.data || [];
  const totalPages = materialsData?.data.totalPages || 1;

  const categoryOptions = React.useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data.map(category => ({
      value: category.id,
      label: category.name,
    }));
  }, [categoriesData]);

  const handleSearch = React.useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = React.useCallback((value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  }, []);

  if (isMaterialsLoading) {
    return (
      <Layout title="Quản lý vật tư">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Quản lý vật tư">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Tìm kiếm vật tư..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            
            <Select
              placeholder="Chọn danh mục"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              options={[
                { value: '', label: 'Tất cả danh mục' },
                ...categoryOptions,
              ]}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="default">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
            <Link to={ROUTES.MATERIALS_CREATE}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm vật tư
              </Button>
            </Link>
          </div>
        </div>

        {/* Materials Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách vật tư</CardTitle>
          </CardHeader>
          <CardContent>
            {materials.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Không có vật tư nào được tìm thấy</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã vật tư</TableHead>
                      <TableHead>Tên vật tư</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Đơn vị</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">
                          {material.code}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{material.name}</div>
                            {material.description && (
                              <div className="text-sm text-gray-500">
                                {material.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{material.category?.name || '-'}</TableCell>
                        <TableCell>{material.unit}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            material.isActive ? STATUS_COLORS.APPROVED : STATUS_COLORS.REJECTED
                          }`}>
                            {material.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatDate(material.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link to={ROUTES.MATERIALS_DETAIL.replace(':id', material.id)}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={ROUTES.MATERIALS_EDIT.replace(':id', material.id)}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">
                          Trang {currentPage} / {totalPages}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          Trước
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MaterialsPage;
