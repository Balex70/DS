import { api } from "@/lib/axios";

export async function stockUpdate(id: number) {
    const res = await api.patch(`/api/store/product-variants/stock-update/${id}`);

    return res.data;
}
