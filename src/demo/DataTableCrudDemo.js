import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../index.css";
import React, { useState, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import Modal from "react-modal";
import "./DataTableDemo.css";
import {
  deleteMultipleRows,
  deleteRow,
  fetchProducts,
  savechanges,
  undo,
  updateUser,
  removesave,
  showHistory,
  restore
} from "../undoRedux/undoSlice";
import { useDispatch, useSelector } from "react-redux";
import Playground from "./playground";

const DataTableCrudDemo = () => {
  let emptyProduct = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: "INSTOCK",
  };
  const navigate = useNavigate();
  const [productDialog, setProductDialog] = useState(false);
  const [expNumber, setExpNumber] = useState("");
  const [expName, setExpName] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.userStore.present);
  const experiments = useSelector((state) => state.userStore.experiments);
  const pastLength = useSelector((state) => state.userStore.past.length);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [saveIsOpen, setSaveOpen] = React.useState(false);
  let subtitle;
  const expLength = useSelector((state) => state.userStore.experiments.length);

  const [selectedProduct1, setSelectedProduct1] = useState();
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [experimentOpen, setExperimentOpen] = useState(true);

  const [modalOpen, setOpen] = React.useState(false);

  let holder = useSelector((state) => state.userStore.history);
  
 

  function dropdownSelection() {
    console.log("event hold", holder);
  }

  const oModal = () => {
    setOpen(true);
    console.log("omodal->>", modalOpen);
    console.log("event hold", holder);
  };

  function cModal() {
    setOpen(false);
    console.log("omodal->>", modalOpen);
  }

  const onRowSelect = (event) => {
    // const trial=event.data;
dispatch(showHistory(event.data));
    console.log("event val", event.data);
    console.log("event holder", holder);
    toast.current.show({
      severity: "info",
      summary: "Product Selected",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Product Unselected",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
  };

  //Getting the currency in a particular platform
  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  //Function for saving product
  const saveProduct = () => {
    setSubmitted(true);
    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };

      if (product.id) {
        const index = findIndexById(product.id);
        _products[index] = _product;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        _product.id = createId();
        _product.image = "product-placeholder.svg";
        _products.push(_product);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }
      dispatch(savechanges()); //Storing into a redux state
      dispatch(updateUser(_products)); //Update the redux state with new products

      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  //Edit a product
  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter((val) => val.id !== product.id);
    dispatch(updateUser(_products));
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    if (selectedUsers.length === 1) {
      dispatch(deleteRow(selectedUsers[0]));
      dispatch(updateUser());
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Deleted",
        life: 3000,
      });
    } else {
      dispatch(deleteMultipleRows(selectedUsers));
      dispatch(updateUser());
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Users Deleted",
        life: 3000,
      });
    }
    setSelectedUsers(null);
  };

  const onCategoryChange = (e) => {
    let _product = { ...product };
    _product["category"] = e.value;
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };
    _product[`${name}`] = val;
    setProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;
    setProduct(_product);
  };

  const experimentDetails = (e) => {
    return (
      <>
        <Button
          label='Show'
          icon='pi pi-calendar-times'
          className='p-button-sucess'
          onClick={() => saveshow(e.time)} //Assigns each saved data with a particular index
        />
        <Button
          label='Remove'
          icon='pi pi-trash'
          className='p-button-danger'
          onClick={() => removeSave(e.time)}
        />
        <Button
          label='Move to playgroud'
          icon='pi pi-arrow-right'
          className='p-button-sucess'
          onClick={() => playgroud(e.time)}
        />
      </>
    );
  };

  function saveshow(time) {
    const temp = experiments.filter((exp) => exp.time === time);
    console.log("temp=", experiments);
    navigate("/saveddata", {
      state: { temp: temp[0].product, expName: temp[0].experiment_name },
    }); //navigating saved data to a new page
  }

  function removeSave(time) {
    dispatch(removesave(time));

    // let newsave = experiments.filter((vall) => vall.idx !== experiments.idx);
    // dispatch(savechanges(newsave));
  }

  function playgroud(time) {
    const temp = experiments.filter((exp) => exp.time === time);

    setSaveOpen(false);

    navigate("/", { state: temp[0].product });
  }

  //Functions for opening and closing modals
  function openModal() {
    setIsOpen(true);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  function savedModal() {
    setSaveOpen(true);
  }
  function saveafterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function savecloseModal() {
    setSaveOpen(false);
  }

  //Function for handling the form values for the save modal
  function sumbitHandler(e) {
    e.preventDefault();

    var time = new Date();
    var AmPm = time.getHours() >= 12 ? "PM" : "AM";
    var timeStamp =
      // time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
      time.getHours() + ":" + time.getMinutes() + " " + AmPm;
    var data = {
      time: timeStamp,
      experiment_name: e.target.Ename.value,
      experiment_number: e.target.Enumber.value,
      product: products,
    };

    dispatch(savechanges(data));
    setIsOpen(false);
    setExpName("");
    setExpNumber("");
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  //Left Toolbar
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label='New'
          icon='pi pi-plus'
          className='p-button-success mr-2'
          onClick={openNew}
        />
        <Button
          label='Delete'
          icon='pi pi-trash'
          className='p-button-danger'
          onClick={confirmDeleteSelected}
        />
        <Button
          label='Undo'
          icon='pi-pi-undo'
          className='p-button'
          disabled={pastLength === 0}
          onClick={() => {
            dispatch(undo());
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Undo success",
              life: 3000,
            });
          }}
        />
        <Button
          label='save'
          icon='pi pi-save'
          className='p-button-success'
          onClick={openModal}
        />
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel='Example Modal'
        >
          <form onSubmit={(e) => sumbitHandler(e)}>
            <h5>Save it NOW!</h5>
            <div className='p-inputgroup'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-user'></i>
              </span>
              <InputText
                id='Enumber'
                placeholder='experiment number'
                value={expNumber}
                onChange={(e) => setExpNumber(e.target.value)}
              />
            </div>
            <div className='p-inputgroup'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-user'></i>
              </span>
              <InputText
                id='Ename'
                placeholder='experiment name'
                value={expName}
                onChange={(e) => setExpName(e.target.value)}
              />
            </div>
            <button type='submit'>SAVE</button>
          </form>
        </Modal>
        <Button
          label='Start Again'
          icon='pi pi-save'
          className='p-button-success'
          onClick={() => dispatch(fetchProducts())}
        />
      </React.Fragment>
    );
  };

  const experimentTemplate = (option) => {
    return (
        <div className='exp-item'>
          <div>{option.experiment_name}</div>
          <div>{option.time}</div>
          <Button>Show</Button>
        </div>
    );
  };

  //   const selectedExperimentTemplate= (option) => {
  //     return (
  //         <div className="exp-item">
  //             <div>{option.experiment_name}</div>
  //            <div>{option.time}</div>
  //         </div>
  //     );
  // }

  // const logger = () => {
  //   setExperimentOpen(true);
  //   console.log("exp open->", experimentOpen);
  // };

  const restoreState =()=>{
    console.log("restore", holder.experiment_name);
    dispatch(restore(holder));
    cModal();
  };

  const rightToolbarTemplate = () => {
    //console.log("experi", experiments );
    dispatch(showHistory(selectedExperiment));
    return (
      <React.Fragment>
        <Dropdown
          //value={selectedExperiment}
          options={experiments}
          onClick={console.log("trying click", selectedExperiment)}
          //onClick={(e) => saveshow(e.time)}
          //onClick={setExperimentOpen(true)}
          //onClick={dropdownSelection}
          onChange={(e) => {
            setOpen(true);
            setSelectedExperiment(e.value);
          
          }}
          optionLabel='experiment_name'
          itemTemplate={experimentTemplate}
          //valueTemplate={selectedExperimentTemplate}
          placeholder='Modifier History'
          
        />

        {holder && <Dialog
          //onClick={oModal}
          visible={modalOpen}
          onHide={cModal}
        >
          {/* <h1>{holder.experiment_name}</h1>
          <h6>{holder.time}</h6> */}

          <DataTable
      ref={dt}
      value={holder.product}
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
        //selectionMode='single'
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
          <Button onClick={restoreState}>Restore</Button>
        </Dialog>}
{/* 
        <button onClick={oModal}>Open Modal</button> */}

        {/* <Modal isOpen={modalOpen} onRequestClose={cModal} ariaHideApp={false}>
          <h1>Check console</h1>
          <button onClick={cModal}>close</button>
        </Modal> */}

        {/* <Button
          label='Saved'
          icon='pi pi-save'
          className='p-button-help'
          onClick={oModal}
          // disabled={expLength === 0}
        />

        <Modal
          isOpen={experimentOpen}
          onAfterOpen={saveafterOpenModal}
          onRequestClose={setExperimentOpen(false)}
          ariaHideApp={false}
          style={customStyles}
          contentLabel='Modal'
        >
          Hi
        </Modal> */}

        <Button
          label='Saved Experiments'
          icon='pi pi-save'
          className='p-button-help'
          onClick={savedModal}
          // disabled={expLength === 0}
        />
        <Modal
          isOpen={saveIsOpen}
          onAfterOpen={saveafterOpenModal}
          onRequestClose={savecloseModal}
          ariaHideApp={false}
          style={customStyles}
          contentLabel='Example Modal'
        >
          <DataTable
            //ref={dt}
            value={experiments}
            // selectionMode={selectedProduct1}
            // onSelectionChange={(e) => setSelectedProduct1(e.value)}
            dataKey='id'
            // paginator
            // rows={10}
            // rowsPerPageOptions={[5, 10, 25]}
            // paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
            // currentPageReportTemplate='Showing {first} to {last} of {totalRecords} products'
            responsiveLayout='scroll'
            onRowSelect={onRowSelect}
            onRowUnselect={onRowUnselect}
          >
            <Column
              selectionMode='single'
              headerStyle={{ width: "3rem" }}
              exportable={false}
            ></Column>
            <Column
              field='time'
              header='Code'
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field='experiment_name'
              header='Name'
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            {/* <Column
              body={experimentDetails}
              exportable={false}
              style={{ minWidth: "8rem" }}
            ></Column> */}
          </DataTable>
          <Button onClick={(e) => saveshow(e.time)}>Show</Button>
        </Modal>
      </React.Fragment>
    );
  };

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
  //each row data actions
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon='pi pi-pencil'
          className='p-button-rounded p-button-success mr-2'
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon='pi pi-trash'
          className='p-button-rounded p-button-warning'
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };
  //search product
  const header = (
    <div className='table-header'>
      <h5 className='mx-0 my-1'>Manage Products</h5>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          type='search'
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder='Search...'
        />
      </span>
    </div>
  );
  //save product
  const productDialogFooter = (
    <React.Fragment>
      <Button
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDialog}
      />
      <Button
        label='Save'
        icon='pi pi-check'
        className='p-button-text'
        onClick={saveProduct}
      />
    </React.Fragment>
  );

  //delete a single product
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label='No'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDeleteProductDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        className='p-button-text'
        onClick={deleteProduct}
      />
    </React.Fragment>
  );
  //delete multiple produts
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label='No'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        className='p-button-text'
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  return (
    <div className='datatable-crud-demo'>
      <Toast ref={toast} />

      <div className='card'>
        <Toolbar
          className='mb-4'
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey='id'
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} products'
          globalFilter={globalFilter}
          header={header}
          responsiveLayout='scroll'
        >
          <Column
            selectionMode='multiple'
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
          <Column
            field='image'
            header='Image'
            body={imageBodyTemplate}
          ></Column>
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
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={productDialog}
        style={{ width: "450px" }}
        header='Product Details'
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        {product.image && (
          <img
            src={`images/product/${product.image}`}
            onError={(e) =>
              (e.target.src =
                "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
            }
            alt={product.image}
            className='product-image block m-auto pb-3'
          />
        )}
        <div className='field'>
          <label htmlFor='name'>Name</label>
          <InputText
            id='name'
            value={product.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !product.name,
            })}
          />
          {submitted && !product.name && (
            <small className='p-error'>Name is required.</small>
          )}
        </div>
        <div className='field'>
          <label htmlFor='description'>Description</label>
          <InputTextarea
            id='description'
            value={product.description}
            onChange={(e) => onInputChange(e, "description")}
            required
            rows={3}
            cols={20}
          />
        </div>

        <div className='field'>
          <label className='mb-3'>Category</label>
          <div className='formgrid grid'>
            <div className='field-radiobutton col-6'>
              <RadioButton
                inputId='category1'
                name='category'
                value='Accessories'
                onChange={onCategoryChange}
                checked={product.category === "Accessories"}
              />
              <label htmlFor='category1'>Accessories</label>
            </div>
            <div className='field-radiobutton col-6'>
              <RadioButton
                inputId='category2'
                name='category'
                value='Clothing'
                onChange={onCategoryChange}
                checked={product.category === "Clothing"}
              />
              <label htmlFor='category2'>Clothing</label>
            </div>
            <div className='field-radiobutton col-6'>
              <RadioButton
                inputId='category3'
                name='category'
                value='Electronics'
                onChange={onCategoryChange}
                checked={product.category === "Electronics"}
              />
              <label htmlFor='category3'>Electronics</label>
            </div>
            <div className='field-radiobutton col-6'>
              <RadioButton
                inputId='category4'
                name='category'
                value='Fitness'
                onChange={onCategoryChange}
                checked={product.category === "Fitness"}
              />
              <label htmlFor='category4'>Fitness</label>
            </div>
          </div>
        </div>

        <div className='formgrid grid'>
          <div className='field col'>
            <label htmlFor='price'>Price</label>
            <InputNumber
              id='price'
              value={product.price}
              onValueChange={(e) => onInputNumberChange(e, "price")}
              mode='currency'
              currency='USD'
              locale='en-US'
            />
          </div>
          <div className='field col'>
            <label htmlFor='quantity'>Quantity</label>
            <InputNumber
              id='quantity'
              value={product.quantity}
              onValueChange={(e) => onInputNumberChange(e, "quantity")}
              integeronly
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "450px" }}
        header='Confirm'
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductsDialog}
        style={{ width: "450px" }}
        header='Confirm'
        modal
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>Are you sure you want to delete the selected products?</span>
          )}
        </div>
      </Dialog>
      <h1>Playground</h1>
      <Playground />
      {/* {Playground()} */}
    </div>

  );
};

export default DataTableCrudDemo;
