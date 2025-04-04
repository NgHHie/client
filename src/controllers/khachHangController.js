import { useGetKhachHangQuery, useAddKhachHangMutation, useEditKhachHangMutation } from "state/api";

export const useFetchKhachHang = (page, pageSize, sort, search) => {
  const { data, isLoading, refetch } = useGetKhachHangQuery({
    page: page + 1,
    pageSize,
    sort: JSON.stringify(sort),
    search: JSON.stringify(search),
  });
  
  return { data, isLoading, refetch };
};

export const useAddCustomer = () => {
  const [addKhachHang] = useAddKhachHangMutation();
  
  const addNewCustomer = async (formData, refetch) => {
    try {
      const response = await addKhachHang(formData).unwrap();
      refetch();
    } catch (error) {
      console.error("Lỗi khi thêm thành viên:", error);
    }
  };

  return { addNewCustomer };
};

export const useEditCustomer = () => {
  const [editKhachHang] = useEditKhachHangMutation();
  
  const editCustomer = async (formData, selectedRow, refetch) => {
    try {
      const response = await editKhachHang({ id: selectedRow.id, ...formData }).unwrap();
      refetch();
      return true;
    } catch (error) {
      console.error("Lỗi khi sửa thành viên:", error);
      return false;
    }
  };

  return { editCustomer };
};
