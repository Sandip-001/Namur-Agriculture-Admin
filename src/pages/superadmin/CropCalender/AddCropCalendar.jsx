import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  Checkbox,
  ListItemText,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import { FaCloudUploadAlt, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MyContext } from "../../../App";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";

const AddCropCalendar = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const { user } = useSelector((state) => state.auth);
  const { setIsHideSidebarAndHeader, setAlertBox } = context;

  // ================= STATES =================
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [productsMap, setProductsMap] = useState({});
  const [product, setProduct] = useState("");
  const [cropDetails, setCropDetails] = useState("");
  const [costEstimates, setCostEstimates] = useState([]);
  const [cultivationTips, setCultivationTips] = useState([]);
  const [pastesDiseasesMaster, setPastesDiseasesMaster] = useState([]); // section 3
  const [stageAssignments, setStageAssignments] = useState([]); // section 4
  const [isLoading, setIsLoading] = useState(false);

  // ================= LIFECYCLE =================
  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  // ----------------- Fetch Products -----------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/api/products");
        const products = res.data;
        const map = {};
        products.forEach((p) => {
          if (!map[p.subcategory_name]) map[p.subcategory_name] = [];
          map[p.subcategory_name].push({ id: p.id, name: p.name });
        });
        setProductsMap(map);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setAlertBox({ type: "error", message: "Failed to load products" });
      }
    };
    fetchProducts();
  }, []);

  // ----------------- Fetch Subcategories only as per Food Category -----------------
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/subcategories");

        const data = res.data
          .filter((sub) => sub.category_name === "Food") // 🔥 Filter by category
          .map((sub) => ({
            id: sub.id,
            name: sub.name,
          }));

        setSubCategories(data);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setAlertBox({ type: "error", message: "Failed to load subcategories" });
      }
    };

    fetchSubCategories();
  }, []);

  // ================= HANDLERS =================
  // Cost Estimates Handlers
  const addCostEstimate = () => {
    setCostEstimates([...costEstimates, { description: "", cost: "" }]);
  };

  const handleCostEstimateChange = (index, field, value) => {
    const updated = [...costEstimates];
    updated[index][field] = value;
    setCostEstimates(updated);
  };

  const deleteCostEstimate = (index) => {
    setCostEstimates(costEstimates.filter((_, i) => i !== index));
  };

  const handleCultivationChange = (index, field, value) => {
    const updated = [...cultivationTips];
    updated[index][field] = value;
    setCultivationTips(updated);

    // 🔥 Sync cultivation name to stageAssignments
    if (field === "name") {
      const stageUpdate = [...stageAssignments];
      if (stageUpdate[index]) {
        stageUpdate[index].cultivation_name = value;
      }
      setStageAssignments(stageUpdate);
    }
  };

  const addCultivationTip = () => {
    const newIndex = cultivationTips.length;

    const newTip = {
      name: "",
      logo_url: "",
      data_url: "",
      youtube_url: "",
      image_url: "",
      sub_stages: [],
    };

    setCultivationTips([...cultivationTips, newTip]);

    setStageAssignments([
      ...stageAssignments,
      {
        stage: String(newIndex + 1),
        cultivation_name: "", // ⬅️ ADDED
        selectedPastesDiseases: [],
      },
    ]);
  };

  // ---------------- Sub-stages ----------------
  const addSubStage = (tipIndex) => {
    const updated = [...cultivationTips];
    if (!updated[tipIndex].sub_stages) updated[tipIndex].sub_stages = [];
    updated[tipIndex].sub_stages.push({ name: "", number_of_days: "" });
    setCultivationTips(updated);
  };

  const handleSubStageChange = (tipIndex, subIndex, field, value) => {
    const updated = [...cultivationTips];
    updated[tipIndex].sub_stages[subIndex][field] = value;
    setCultivationTips(updated);
  };

  const deleteSubStage = (tipIndex, subIndex) => {
    const updated = [...cultivationTips];
    updated[tipIndex].sub_stages.splice(subIndex, 1);
    setCultivationTips(updated);
  };

  const deleteCultivationTip = (index) => {
    setCultivationTips(cultivationTips.filter((_, i) => i !== index));
    setStageAssignments(stageAssignments.filter((_, i) => i !== index));
  };

  const handleAddPasteDisease = () => {
    setPastesDiseasesMaster([
      ...pastesDiseasesMaster,
      { name: "", logo_url: "", document_url: "" },
    ]);
  };

  const handlePasteDiseaseChange = (index, field, value) => {
    const updated = [...pastesDiseasesMaster];
    updated[index][field] = value;
    setPastesDiseasesMaster(updated);
  };

  const handleStageAssignmentChange = (stageIndex, selectedNames) => {
    const updated = [...stageAssignments];
    updated[stageIndex].selectedPastesDiseases = selectedNames;
    setStageAssignments(updated);
  };

  const handleSubmit = async () => {
    if (!selectedSubCategory || !product) {
      return setAlertBox({
        type: "error",
        message: "Please fill all required fields!",
      });
    }
    setIsLoading(true);
    try {
      const stageDetails = stageAssignments.map((stage) => ({
        stage: stage.stage,
        cultivation_name: stage.cultivation_name || "", // 🔥 Include cultivation name
        problems: stage.selectedPastesDiseases.map((name) =>
          pastesDiseasesMaster.find((pd) => pd.name === name)
        ),
      }));

      const payload = {
        sub_category_id: selectedSubCategory.id,
        product_id: product.id,
        crop_details: cropDetails,
        cost_estimate: costEstimates,
        cultivation_tips: cultivationTips,
        paste_and_diseases: pastesDiseasesMaster,
        stages_selection: stageDetails,
        created_by: user?.name || "Anonymous",
        creator_id: user?.id || "0",
      };

      //console.log("Crop calender payloads are", payload);

      await axiosInstance.post("/api/crop-calendars", payload);
      setAlertBox({
        error: false,
        open: true,
        message: "Crop Calendar created successfully!",
      });

      setSelectedSubCategory("");
      setProduct("");
      setCropDetails("");
      setCultivationTips([]);
      setPastesDiseasesMaster([]);
      setStageAssignments([]);
      navigate("/crop-calender-list");
    } catch (err) {
      console.error(err);
      setAlertBox({
        error: true,
        open: true,
        message:
          err.response?.data?.message || "Failed to create crop calendar.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ================== JSX ==================
  return (
    <div className="right-content w-100">
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, width: "100%" }}>
        <Typography variant="h5" mb={3} fontWeight={600}>
          Create Crop Calendar
        </Typography>

        <Grid container spacing={4}>
          {/* 1. Crop Details */}
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, width: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Crop Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
                    <FormControl fullWidth>
                      <InputLabel>Sub Category</InputLabel>
                      <Select
                        value={selectedSubCategory?.id || ""}
                        onChange={(e) => {
                          const selected = subCategories.find(
                            (s) => s.id === e.target.value
                          );
                          setSelectedSubCategory(selected);
                          setProduct(""); // reset product selection
                        }}
                        label="Sub Category"
                      >
                        {subCategories.map((sub) => (
                          <MenuItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
                    <FormControl fullWidth disabled={!selectedSubCategory}>
                      <InputLabel>Product</InputLabel>
                      <Select
                        value={product?.id || ""}
                        onChange={(e) => {
                          const selectedProduct = (
                            productsMap[selectedSubCategory.name] || []
                          ).find((p) => p.id === e.target.value);
                          setProduct(selectedProduct);
                        }}
                        label="Product"
                      >
                        {(productsMap[selectedSubCategory.name] || []).map(
                          (prod) => (
                            <MenuItem key={prod.id} value={prod.id}>
                              {prod.name}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sx={{ width: "100%" }}>
                    <TextField
                      label="Crop Details (Google Drive URL)"
                      fullWidth
                      value={cropDetails}
                      onChange={(e) => setCropDetails(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/*  Cost Estimates  */}
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, width: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cost Estimates
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {costEstimates.map((item, i) => (
                  <Card
                    key={i}
                    sx={{ mb: 2, p: 2, position: "relative", width: "100%" }}
                  >
                    <IconButton
                      onClick={() => deleteCostEstimate(i)}
                      sx={{ position: "absolute", top: 5, right: 5 }}
                    >
                      <MdDelete />
                    </IconButton>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          label="Description"
                          fullWidth
                          value={item.description}
                          onChange={(e) =>
                            handleCostEstimateChange(
                              i,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Cost (₹)"
                          type="number"
                          fullWidth
                          value={item.cost}
                          onChange={(e) =>
                            handleCostEstimateChange(i, "cost", e.target.value)
                          }
                        />
                      </Grid>
                    </Grid>
                  </Card>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<FaPlus />}
                  onClick={addCostEstimate}
                >
                  Add Cost Estimate
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* 2. Cultivation Tips */}
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, width: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cultivation Tips
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {cultivationTips.map((tip, i) => (
                  <Card
                    key={i}
                    sx={{ mb: 2, p: 2, position: "relative", width: "100%" }}
                  >
                    <IconButton
                      onClick={() => deleteCultivationTip(i)}
                      sx={{ position: "absolute", top: 5, right: 5 }}
                    >
                      <MdDelete />
                    </IconButton>

                    <Grid container spacing={2}>
                      {/* Main fields */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Name"
                          value={tip.name}
                          onChange={(e) =>
                            handleCultivationChange(i, "name", e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Logo URL"
                          value={tip.logo_url}
                          onChange={(e) =>
                            handleCultivationChange(
                              i,
                              "logo_url",
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Image URL"
                          value={tip.image_url}
                          onChange={(e) =>
                            handleCultivationChange(
                              i,
                              "image_url",
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="YouTube URL"
                          value={tip.youtube_url}
                          onChange={(e) =>
                            handleCultivationChange(
                              i,
                              "youtube_url",
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Data URL"
                          value={tip.data_url}
                          onChange={(e) =>
                            handleCultivationChange(
                              i,
                              "data_url",
                              e.target.value
                            )
                          }
                          fullWidth
                        />
                      </Grid>

                      {/* Sub-stages section */}
                      {(tip.sub_stages || []).length > 0 && (
                        <Grid item xs={12} sx={{ width: "100%" }}>
                          <Divider />
                          <Typography variant="subtitle1" gutterBottom>
                            Sub Stages
                          </Typography>
                        </Grid>
                      )}

                      {(tip.sub_stages || []).map((sub, sIndex) => (
                        <Grid
                          container
                          spacing={2}
                          key={sIndex}
                          sx={{ mt: 1, width: "100%" }}
                        >
                          <Grid item xs={12} sm={5}>
                            <TextField
                              label="Sub Stage Name"
                              value={sub.name}
                              onChange={(e) =>
                                handleSubStageChange(
                                  i,
                                  sIndex,
                                  "name",
                                  e.target.value
                                )
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <TextField
                              label="Number of Days"
                              type="number"
                              value={sub.number_of_days}
                              onChange={(e) =>
                                handleSubStageChange(
                                  i,
                                  sIndex,
                                  "number_of_days",
                                  e.target.value
                                )
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <IconButton
                              onClick={() => deleteSubStage(i, sIndex)}
                            >
                              <MdDelete />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}

                      {/* Add Sub Stage Button */}
                      <Grid item xs={12}>
                        <Button
                          startIcon={<FaPlus />}
                          onClick={() => addSubStage(i)}
                          sx={{ mt: 1 }}
                        >
                          Add Sub Stage
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<FaPlus />}
                  onClick={addCultivationTip}
                >
                  Add Cultivation Tip
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* 3. Create Pests & Diseases */}
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, width: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Create Pests & Diseases
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {pastesDiseasesMaster.map((pd, i) => (
                  <Grid
                    container
                    spacing={2}
                    key={i}
                    sx={{ mb: 1, width: "100%" }}
                  >
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Name"
                        value={pd.name}
                        onChange={(e) =>
                          handlePasteDiseaseChange(i, "name", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Logo URL"
                        value={pd.logo_url}
                        onChange={(e) =>
                          handlePasteDiseaseChange(
                            i,
                            "logo_url",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Document URL"
                        value={pd.document_url}
                        onChange={(e) =>
                          handlePasteDiseaseChange(
                            i,
                            "document_url",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<FaPlus />}
                  onClick={handleAddPasteDisease}
                >
                  Add Pests & Diseases
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* 4. Assign Pests & Diseases to Stage */}
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, width: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pests & Diseases Selector
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {stageAssignments.map((stage, index) => (
                  <div key={index} className="mb-3" style={{ width: "100%" }}>
                    <Typography variant="subtitle1">
                      Stage: {stage.stage}
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel>Select Pests & Diseases</InputLabel>
                      <Select
                        multiple
                        value={stage.selectedPastesDiseases}
                        onChange={(e) =>
                          handleStageAssignmentChange(index, e.target.value)
                        }
                        input={
                          <OutlinedInput label="Select Pests & Diseases" />
                        }
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {pastesDiseasesMaster.map((pd) => (
                          <MenuItem key={pd.name} value={pd.name}>
                            <Checkbox
                              checked={
                                stage.selectedPastesDiseases.indexOf(pd.name) >
                                -1
                              }
                            />
                            <ListItemText primary={pd.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Button
              type="button"
              onClick={handleSubmit}
              variant="contained"
              fullWidth
              disabled={isLoading}
              startIcon={<FaCloudUploadAlt />}
            >
              {isLoading ? "Saving..." : "Create Crop Calendar"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default AddCropCalendar;
