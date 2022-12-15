import urqlQuery from "~/graphql/";
import { GetProducts } from "~/graphql/queries/products";
import {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
} from "~/graphql/mutations/products";
import type { Dispatch } from "redux";
import slugify from "slugify";
import {
  requestStartInitilizeLoading,
  requestSuccessUpdateStateData,
  requestCompleteDisableLoading,
} from "../../";
import { notification } from "antd";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export function GetProductsAction() {
  return async (dispatch: Dispatch) => {
    dispatch(requestStartInitilizeLoading());
    try {
      const vendorId = cookies.get("vendorId");
      urqlQuery
        .query(GetProducts, {
          vendorId,
        })
        .toPromise()
        .then((result) => {
          if (!result || !result.data) {
            throw new Error("Something went wrong");
          }
          dispatch(requestSuccessUpdateStateData(result.data.getProducts.list));
        });
    } catch (error) {
      throw error;
    }
  };
}

export function ProductsAction(
  data: any,
  setProductDrawerOpen: any,
  selectedAction: string,
  id: string
) {
  return async (dispatch: Dispatch, state: any) => {
    dispatch(requestStartInitilizeLoading());
    try {
      data.vendorId = cookies.get("vendorId");
      data.image = "new image";

      const suggestedSlug = slugify(data.title, {
        replacement: "-",
        remove: /[^\w\s]/gi,
      })
        .replace(/'_+/g, "")
        .toLowerCase();
      data.slug = suggestedSlug;

      urqlQuery
        .mutation(
          selectedAction === "new-product" ? CreateProduct : UpdateProduct,
          selectedAction === "new-product"
            ? {
                ...data,
              }
            : {
                ...data,
                id: id,
              }
        )
        .toPromise()
        .then((result) => {
          if (!result || !result.data) {
            dispatch(requestCompleteDisableLoading());
            throw new Error("Something went wrong");
          }

          let stateData = state();

          if (selectedAction === "new-product") {
            let newStateData = [
              ...stateData.app.data,
              result?.data?.createProduct,
            ];

            dispatch(requestSuccessUpdateStateData(newStateData));
          } else {
            const filteredData = stateData.app.data.filter(
              (product: any) => product.id !== data.id
            );
            let newStateData = [result?.data?.updateProduct, ...filteredData];
            dispatch(requestSuccessUpdateStateData(newStateData));
          }

          notification.success({
            message:
              selectedAction === "new-product"
                ? "Product created successfully"
                : "Product updated successfully",
          });
          setProductDrawerOpen(false);
          dispatch(requestCompleteDisableLoading());
        });
    } catch (error) {
      throw error;
    }
  };
}

export function DeleteProductAction(id: string) {
  return async (dispatch: Dispatch, state: any) => {
    dispatch(requestStartInitilizeLoading());
    let stateData = state();

    let records = stateData.app.data;
    try {
      urqlQuery
        .mutation(DeleteProduct, {
          id,
        })
        .toPromise()
        .then((result) => {
          if (!result || !result.data) {
            throw new Error("Something went wrong");
          }
          let filteredRecords = records.filter(
            (record: any) => record.id !== id
          );

          notification.success({
            message: "Product deleted successfully",
          });
          dispatch(requestSuccessUpdateStateData(filteredRecords));
          dispatch(requestCompleteDisableLoading());
        });
    } catch (error) {
      throw error;
    }
  };
}
