import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  IconButton,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../../utils/axiosInstance";
import { MyContext } from "../../../App";

const EditCropCalendarModal = ({
  open,
  handleClose,
  selectedCalendar,
  fetchCalendars,
  setAlertBox,
}) => {
  // ================= STATES =================
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [productsMap, setProductsMap] = useState({});
  const [product, setProduct] = useState("");
  const [cropDetails, setCropDetails] = useState("");
  const [costEstimates, setCostEstimates] = useState([]);
  const [cultivationTips, setCultivationTips] = useState([]);
  const [pastesDiseasesMaster, setPastesDiseasesMaster] = useState([]);
  const [stageAssignments, setStageAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ================= INIT FORM =================
  useEffect(() => {
    if (!selectedCalendar) return;
    setCropDetails(selectedCalendar.crop_details || "");
    setCostEstimates(selectedCalendar.cost_estimate || []);

    setCultivationTips(
      (selectedCalendar.cultivation_tips || []).map((tip) => ({
        ...tip,
        sub_stages: tip.sub_stages || [],
      }))
    );

    setPastesDiseasesMaster(selectedCalendar.paste_and_diseases || []);

    setStageAssignments(
      (selectedCalendar.stages_selection || []).map((stage, index) => ({
        stage: stage.stage || String(index + 1),
        cultivation_name:
          stage.cultivation_name ||
          selectedCalendar.cultivation_tips?.[index]?.name ||
          "",
        selectedPastesDiseases: (stage.problems || []).map((p) => p.name || ""),
      }))
    );
  }, [selectedCalendar]);

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

  // 🔥 Sync selected values once dropdown data is available
  useEffect(() => {
    if (!selectedCalendar || subCategories.length === 0) return;

    const matchedSub = subCategories.find(
      (sub) => sub.id === selectedCalendar.sub_category_id
    );
    setSelectedSubCategory(matchedSub || "");
  }, [subCategories, selectedCalendar]);

  useEffect(() => {
    if (
      !selectedCalendar ||
      !selectedSubCategory ||
      !productsMap[selectedSubCategory.name]
    )
      return;

    const matchedProduct = productsMap[selectedSubCategory.name].find(
      (p) => p.id === selectedCalendar.product_id
    );
    setProduct(matchedProduct || "");
  }, [productsMap, selectedSubCategory, selectedCalendar]);

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
      setStageAssignments((prev) => {
        const updated = [...prev];
        if (!updated[index]) {
          updated[index] = {
            stage: String(index + 1),
            selectedPastesDiseases: [],
          };
        }
        updated[index].cultivation_name = value;
        return updated;
      });
    }
  };

  const addCultivationTip = () => {
    setCultivationTips([
      ...cultivationTips,
      {
        name: "",
        logo_url: "",
        data_url: "",
        youtube_url: "",
        image_url: "",
        sub_stages: [],
      },
    ]);
    setStageAssignments([
      ...stageAssignments,
      {
        stage: String(cultivationTips.length + 1),
        cultivation_name: "",
        selectedPastesDiseases: [],
      },
    ]);
  };

  const deleteCultivationTip = (index) => {
    setCultivationTips(cultivationTips.filter((_, i) => i !== index));
    setStageAssignments(stageAssignments.filter((_, i) => i !== index));
  };

  const handleSubStageChange = (tipIndex, subIndex, field, value) => {
    const updated = [...cultivationTips];
    updated[tipIndex].sub_stages[subIndex][field] = value;
    setCultivationTips(updated);
  };

  const addSubStage = (tipIndex) => {
    const updated = [...cultivationTips];
    updated[tipIndex].sub_stages.push({ name: "", number_of_days: "" });
    setCultivationTips(updated);
  };

  const deleteSubStage = (tipIndex, subIndex) => {
    const updated = [...cultivationTips];
    updated[tipIndex].sub_stages.splice(subIndex, 1);
    setCultivationTips(updated);
  };

  const handlePasteDiseaseChange = (index, field, value) => {
    const updated = [...pastesDiseasesMaster];
    updated[index][field] = value;
    setPastesDiseasesMaster(updated);
  };

  const addPasteDisease = () => {
    setPastesDiseasesMaster([
      ...pastesDiseasesMaster,
      { name: "", logo_url: "", document_url: "" },
    ]);
  };

  const deletePasteDisease = (index) => {
    setPastesDiseasesMaster(pastesDiseasesMaster.filter((_, i) => i !== index));
  };

  const handleStageAssignmentChange = (stageIndex, selectedNames) => {
    const updated = [...stageAssignments];
    updated[stageIndex].selectedPastesDiseases = selectedNames;
    setStageAssignments(updated);
  };

  const handleSave = async () => {
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
      };

      console.log("Crop calender updated payload is", payload);

      await axiosInstance.put(
        `/api/crop-calendars/${selectedCalendar.id}`,
        payload
      );

      setAlertBox({
        open: true,
        msg: "Crop Calendar updated successfully!",
        error: false,
      });
      handleClose();
      fetchCalendars();
    } catch (err) {
      console.error(err);
      setAlertBox({ open: true, msg: "Update failed!", error: true });
    } finally {
      setIsLoading(false);
    }
  };

  // ================= JSX =================
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle className="d-flex justify-content-between align-items-center">
        Edit Crop Calendar
        <IconButton onClick={handleClose}>
          <IoCloseSharp />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* 1. Crop Details */}
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Crop Details</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
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

                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12}>
                  <TextField
                    label="Crop Details (GDrive URL)"
                    value={cropDetails}
                    fullWidth
                    onChange={(e) => setCropDetails(e.target.value)}
                  />
                </Grid>
              </Grid>
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
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Cultivation Tips</Typography>
              <Divider sx={{ mb: 2 }} />
              {cultivationTips.map((tip, i) => (
                <Card key={i} sx={{ mb: 2, p: 2, position: "relative" }}>
                  <IconButton
                    onClick={() => deleteCultivationTip(i)}
                    sx={{ position: "absolute", top: 5, right: 5 }}
                  >
                    <MdDelete />
                  </IconButton>
                  <Grid container spacing={2}>
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
                          handleCultivationChange(i, "logo_url", e.target.value)
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
                          handleCultivationChange(i, "data_url", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>

                    {/* Sub-stages section */}
                    {(tip.sub_stages || []).length > 0 && (
                      <Grid item xs={12} sx={{ width: "100%" }}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>
                          Sub Stages
                        </Typography>
                      </Grid>
                    )}

                    {/* Sub-stage inputs */}
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
                          <IconButton onClick={() => deleteSubStage(i, sIndex)}>
                            <MdDelete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}

                    {/* Add Sub Stage button */}
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
              <Button startIcon={<FaPlus />} onClick={addCultivationTip}>
                Add Cultivation Tip
              </Button>
            </Card>
          </Grid>

          {/* 3. Pests & Diseases */}
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Pests & Diseases</Typography>
              <Divider sx={{ mb: 2 }} />
              {pastesDiseasesMaster.map((pd, i) => (
                <Grid
                  container
                  spacing={2}
                  key={i}
                  sx={{ mb: 1, alignItems: "center" }}
                >
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Name"
                      value={pd.name}
                      onChange={(e) =>
                        handlePasteDiseaseChange(i, "name", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Logo URL"
                      value={pd.logo_url}
                      onChange={(e) =>
                        handlePasteDiseaseChange(i, "logo_url", e.target.value)
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
                  <Grid item xs={12} sm={2}>
                    <IconButton onClick={() => deletePasteDisease(i)}>
                      <MdDelete />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button startIcon={<FaPlus />} onClick={addPasteDisease}>
                Add Pests & Diseases
              </Button>
            </Card>
          </Grid>

          {/* 4. Assign Pests & Diseases to Stage */}
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Pests & Diseases Selector</Typography>
              <Divider sx={{ mb: 2 }} />
              {stageAssignments.map((stage, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <Typography>Stage: {stage.stage}</Typography>
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </Grid>
              ))}
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCropCalendarModal;
