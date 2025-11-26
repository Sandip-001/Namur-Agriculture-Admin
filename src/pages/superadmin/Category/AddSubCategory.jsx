import React, { useContext, useEffect, useState } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Button, CircularProgress } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../../App";

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const AddSubCategory = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox } = context;

  const [categories, setCategories] = useState([]);
  const [catId, setCatId] = useState("");
  const [subCatName, setSubCatName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);

    // fetch categories
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!catId || !subCatName) return;

    setIsLoading(true);
    try {
      await axiosInstance.post("/api/subcategories", {
        name: subCatName,
        category_id: catId,
      });

      setAlertBox({
        open: true,
        msg: "Subcategory created successfully!",
        error: false,
      });

      setSubCatName("");
      setCatId("");
      navigate("/subCategory-list");
    } catch (err) {
      console.error("Error creating subcategory:", err);
      setAlertBox({
        open: true,
        msg: "Failed to create subcategory",
        error: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4">
        <h5 className="mb-0">Create Sub Category</h5>
        <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumbs_">
          <StyledBreadcrumb
            component="a"
            href="#"
            label="Category & Sub-Category"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb label="Add Sub Category" component="a" href="#" />
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div className="card p-4">
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <Select
                      value={catId}
                      onChange={(e) => setCatId(e.target.value)}
                      displayEmpty
                      className="w-100"
                      required
                    >
                      <MenuItem value="">
                        <em>Select Category</em>
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <input
                      type="text"
                      value={subCatName}
                      placeholder="Enter Sub Category Name"
                      onChange={(e) => setSubCatName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                  type="button"
                  onClick={handleSubmit}
                className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                style={{ margin: "auto" }}
                disabled={isLoading}
              >
                <FaCloudUploadAlt />
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "PUBLISH AND VIEW"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSubCategory;
