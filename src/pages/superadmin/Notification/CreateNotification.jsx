import {
  Box,
  Button,
  Typography,
  MenuItem,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  InputLabel,
  Switch,
  ListItemText,
  Checkbox,
  OutlinedInput,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import karnatakaData from "../../../data/karnataka_districts_taluks_villages.json";

const CreateNotification = () => {
  const [targetType, setTargetType] = useState("all");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectSubCat, setSelectSubCat] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("")

  const [selectFpo, setSelectFpo] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");


  const districtOptions = Object.keys(karnatakaData).map((d) => ({
    label: d,
    value: d,
  }));

  const handledistChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDistricts(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = () => {
    const payload = {
      targetType,
      districts: selectedDistricts,
      subCategory: selectSubCat,
      product: selectedProduct,
      fpo: selectFpo,
      title,
      message,
    };
    console.log("Sending Notification Payload:", payload);
    // Add Firebase push/send logic here
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="right-content w-100">
        <Box
          sx={{
            p: 4,
            backgroundColor: "#f9f9f9",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            fontWeight={600}
            textAlign="center"
          >
            Create Notification
          </Typography>

          <FormControl fullWidth margin="normal">
            <FormLabel>Send To</FormLabel>
            <RadioGroup
              row
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
            >
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="All Users"
              />
              <FormControlLabel
                value="district"
                control={<Radio />}
                label="District-wise"
              />

              <FormControlLabel value="fpo" control={<Radio />} label="FPO" />
            </RadioGroup>
          </FormControl>

          {targetType === "district" && (
            <>
              <FormControl fullWidth>
                <InputLabel>Select District</InputLabel>
                <Select
                  multiple
                  value={selectedDistricts}
                  onChange={handledistChange}
                  input={<OutlinedInput label="Select District" />}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {districtOptions.map((dist) => (
                    <MenuItem key={dist.value} value={dist.value}>
                      <Checkbox
                        checked={selectedDistricts.includes(dist.value)}
                      />
                      <ListItemText primary={dist.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth className="mt-3">
                <InputLabel>Select Sub-Category</InputLabel>
                <Select
                  value={selectSubCat}
                  onChange={(e) => setSelectSubCat(e.target.value)}
                  input={<OutlinedInput label="Select Sub-Category" />}
                >
                  {[
                    "Animals",
                    "Birds",
                    "Vegetables",
                    "Fruits",
                    "Machine",
                    "House Items",
                  ].map((sub) => (
                    <MenuItem key={sub} value={sub}>
                      {sub}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth className="mt-3">
                <InputLabel>Select Product</InputLabel>
                <Select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  input={<OutlinedInput label="Select Product" />}
                >
                  {[
                    "Cow",
                    "Goat",
                    "Parrot",
                    "Milk",
                    "Egg",
                    "Tractor",
                    "Harvester",
                    "Onion",
                  ].map((product) => (
                    <MenuItem key={product} value={product}>
                      {product}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {targetType === "fpo" && (
            <>
              <FormControl fullWidth>
                <InputLabel>Select FPO</InputLabel>
                <Select
                  value={selectFpo}
                  onChange={(e) => setSelectFpo(e.target.value)}
                  input={<OutlinedInput label="Select FPO" />}
                >
                  {[
                    "GreenHarvest FPO",
                    "AgroUnited Farmers",
                    "Kisan Jyoti Group",
                    "Bhoomi Rakshak FPO",
                    "Siri Farmers Collective",
                    "Mitti Bandhu Producer Co.",
                    "Krushi Vikas Farmers",
                    "Annadata Farmer Group",
                  ].map((fpo) => (
                    <MenuItem key={fpo} value={fpo}>
                      {fpo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          <TextField
            fullWidth
            label="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            style={{
              marginTop: "3rem",
              backgroundColor: "#a9ffa9"
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notification Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            margin="normal"
            style={{
              backgroundColor: "#a9ffa9",
            }}
          />

          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
            >
              {"Send Now"}
            </Button>
          </Box>
        </Box>
      </div>
    </LocalizationProvider>
  );
};

export default CreateNotification;
