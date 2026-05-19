import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import type { IBook } from "@/commons/types";
import BookService from "@/services/book-service";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

export const BookListPage = () => {
  const [data, setData] = useState<IBook[]>([]);
  const { findAll, remove } = BookService;
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  // hook do react para executar ações ao carregar o componente
  // carrega a lista de produtos
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // função para carregar a lista de produtos
  const loadData = async () => {
    const response = await findAll();

    if (response.status === 200) {
      setData(Array.isArray(response.data) ? response.data : []);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar a lista de produtos.",
        life: 3000,
      });
    }
  };

  const handleEdit = (book: IBook) => {
    navigate(`/books/${book.id}`);
  };

  const handleDelete = async (book: IBook) => {
    if (confirm(`Tem certeza que deseja excluir "${book.name}"?`)) {
      if (book.id) {
        try {
          await remove(book.id);
          setData((prev) => prev.filter((c) => c.id !== book.id));
          toast.current?.show({
            severity: "success",
            summary: "Sucesso",
            detail: "Registro removido com sucesso",
            life: 3000,
          });
        } catch {
          toast.current?.show({
            severity: "error",
            summary: "Erro",
            detail: "Não foi possível remover o registro.",
            life: 3000,
          });
        }
      }
    }
  };

  const actionTemplate = (rowData: IBook) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-sm p-button-text"
        onClick={() => handleEdit(rowData)}
        tooltip="Editar"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-sm p-button-text p-button-danger"
        onClick={() => handleDelete(rowData)}
        tooltip="Excluir"
      />
    </div>
  );

  const priceTemplate = (rowData: IBook) => {
    return rowData.price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="container mx-auto px-4 pt-24">
      <Toast ref={toast} />
      <h2 className="text-2xl mb-4">Lista de Produtos</h2>
      <DataTable value={data} stripedRows>
        <Column field="id" header="ID" style={{ width: "5%" }} />
        <Column field="name" header="Nome" />
        <Column field="description" header="Descrição" />
        <Column header="Preço" body={priceTemplate} style={{ width: "15%" }} />
        <Column field="category.name" header="Categoria" />
        <Column body={actionTemplate} header="Ações" style={{ width: "15%" }} />
      </DataTable>
    </div>
  );
};