import { DataTable } from "primereact/datatable";
import "./DataTableDemo.css";
import { Column } from "primereact/column";
import { Rating } from "primereact/rating";
import React, { useState, useRef } from "react";
//import { Button } from "primereact/button";
import { useLocation } from "react-router-dom";
const SavedData = () => {
  const dt = useRef(null);
  const location = useLocation();
  console.log("ename", location.state.expName);
  console.log("sandy", location.state);

  const [selectedProducts, setSelectedProducts] = useState(null);
  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`images/product/${rowData.image}`}
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
        alt={rowData.image}
        className='product-image'
      />
    );
  };
  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
  };
  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };
  const statusBodyTemplate = (rowData) => {
    return (
      <span
        className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}
      >
        {rowData.inventoryStatus}
      </span>
    );
  };
  // const actionBodyTemplate = (rowData) => {
  //   return (
  //     <React.Fragment>
  //       <Button
  //         icon='pi pi-pencil'
  //         className='p-button-rounded p-button-success mr-2'
  //       />
  //       <Button
  //         icon='pi pi-trash'
  //         className='p-button-rounded p-button-warning'
  //       />
  //     </React.Fragment>
  //   );
  // };
  return (
    <DataTable
      ref={dt}
      value={location.state.temp}
      selection={selectedProducts}
      onSelectionChange={(e) => setSelectedProducts(e.value)}
      dataKey='id'
      // paginator
      // rows={10}
      // rowsPerPageOptions={[5, 10, 25]}
      // paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
      // currentPageReportTemplate='Showing {first} to {last} of {totalRecords} products'
      responsiveLayout='scroll'
    >
         <Column
        selectionMode='single'
        headerStyle={{ width: "3rem" }}
        exportable={false}
      ></Column>
      <Column
        field='code'
        header='Code'
        sortable
        style={{ minWidth: "12rem" }}
      ></Column>
      <Column
        field='name'
        header='Name'
        sortable
        style={{ minWidth: "16rem" }}
      ></Column>
      <Column field='image' header='Image' body={imageBodyTemplate}></Column>
      <Column
        field='price'
        header='Price'
        body={priceBodyTemplate}
        sortable
        style={{ minWidth: "8rem" }}
      ></Column>
      <Column
        field='category'
        header='Category'
        sortable
        style={{ minWidth: "10rem" }}
      ></Column>
      <Column
        field='rating'
        header='Reviews'
        body={ratingBodyTemplate}
        sortable
        style={{ minWidth: "12rem" }}
      ></Column>
      <Column
        field='inventoryStatus'
        header='Status'
        body={statusBodyTemplate}
        sortable
        style={{ minWidth: "12rem" }}
      ></Column>
      {/* <Column
        body={actionBodyTemplate}
        exportable={false}
        style={{ minWidth: "8rem" }}
      ></Column> */}
    </DataTable>
  );
};

export default SavedData;
