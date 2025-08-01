import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Modal,
  Box,
  TextField,
  Button,
  Autocomplete,
  Switch,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { FaEdit } from "react-icons/fa";
import man1 from "../../../assets/man1.png";
import onion from "../../../assets/onion.png";
import goat from "../../../assets/goat.png";
import cow from "../../../assets/cow.png";
import tractor from "../../../assets/tractor.png";
import plow from "../../../assets/plow.png";
import corn from "../../../assets/corn.png";

import karnatakaData from "../../../data/karnataka_districts_taluks_villages.json";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  marginBottom: theme.spacing(4),
}));

const fpoNames = [
  "Green Harvest Farmers Group",
  "Golden Fields Producer Company",
  "AgriRise Collective",
  "Fresh Roots FPO",
  "ProsperAgro Farmers Society",
  "NatureBloom Producers",
  "VillageCrop Growers Association",
  "EcoHarvest Producer Group",
  "Sunrise Agri Collective",
  "Unity Farmers Federation",
  "AgroTrust Farmers Group",
  "Evergreen Fields FPO",
  "FarmNest Producers",
  "HappyHarvest Collective",
  "AgriUnity Farmers Co-op",
];

const sellerProfile = {
  name: "Ramesh Yadav",
  email: "ramesh@example.com",
  phone: "+91 9876543210",
  profilePhoto: man1,
  address: {
    district: "Pune",
    taluk: "Haveli",
    gramPanchayat: "Mulshi",
    village: "Lavale",
    pincode: "411042",
  },
  fpoGroup: "VillageCrop Growers Association",
  lands: [
    {
      district: "mandya",
      taluk: "Srirangapatna",
      village: "PALAHALLI",
      landName: "Land A",
      areaName: "Green Valley",
      surveyNo: 132,
      hissaNo: 1,
      areaAcres: 2.5,
      crops: [
        { name: "Onion", image: onion, acres: 1.2 },
        { name: "Corn", image: corn, acres: 1.3 },
        { name: "Onion", image: onion, acres: 1.2 },
        { name: "Corn", image: corn, acres: 1.3 },
        { name: "Onion", image: onion, acres: 1.2 },
        { name: "Corn", image: corn, acres: 1.3 },
      ],
      machines: [
        { name: "Tractor", image: tractor },
        { name: "Plough", image: plow },
      ],
      animals: [
        { name: "Cow", image: cow, quantity: 3 },
        { name: "Goat", image: goat, quantity: 5 },
      ],
    },
    {
      district: "Raichur",
      taluk: "Manvi",
      village: "AROLI",
      landName: "Land B",
      areaName: "Sunset Field",
      surveyNo: 456,
      hissaNo: 2,
      areaAcres: 1.8,
      crops: [{ name: "Corn", image: corn, acres: 1.8 }],
      machines: [{ name: "Plough", image: plow }],
      animals: [
        {
          name: "Buffalo",
          image: cow,
          quantity: 2,
        },
      ],
    },
  ],
};

const SellerProfile = () => {
  const [selectedLandIndex, setSelectedLandIndex] = useState(0);
  const selectedLand = sellerProfile.lands[selectedLandIndex];

  const [editMode, setEditMode] = useState(true); // Default ON (editable)

  const [landIndex, setLandIndex] = useState(0);
  const [profileModal, openProfileModal] = useState(false);
  const [landModal, openLandModal] = useState(false);

  // profile fields
  const [name, setName] = useState(sellerProfile.name);
  const [phone, setPhone] = useState(sellerProfile.phone);
  const [address, setAddress] = useState({ ...sellerProfile.address });
  const [fpo, setFpo] = useState(sellerProfile.fpoGroup);

  // land editing state
  const currentLand = sellerProfile.lands[landIndex];

  const [district, setDistrict] = useState(currentLand.district);
  const [taluk, setTaluk] = useState(currentLand.taluk);
  const [village, setVillage] = useState(currentLand.village);
  const [landName, setLandName] = useState(currentLand.landName);
  const [areaName, setAreaName] = useState(currentLand.areaName);
  const [surveyNo, setSurveyNo] = useState(currentLand.surveyNo);
  const [hissaNo, setHissaNo] = useState(currentLand.hissaNo);
  const [areaAcres, setAreaAcres] = useState(currentLand.areaAcres);
  const [crops, setCrops] = useState([...currentLand.crops]);
  const [cropSelect, setCropSelect] = useState("");
  const [cropAcres, setCropAcres] = useState("");
  const [machines, setMachines] = useState([...currentLand.machines]);
  const [machineSelect, setMachineSelect] = useState([]);
  const [animals, setAnimals] = useState([...currentLand.animals]);
  const [animalSelect, setAnimalSelect] = useState("");
  const [animalQty, setAnimalQty] = useState("");

  const districtOptions = Object.keys(karnatakaData).map((d) => ({
    label: d,
    value: d,
  }));

  const talukOptions = district
    ? Object.keys(karnatakaData[district] || {}).map((t) => ({
        label: t,
        value: t,
      }))
    : [];

  const villageOptions =
    district && taluk
      ? (karnatakaData[district]?.[taluk] || []).map((v) => ({
          label: v,
          value: v,
        }))
      : [];

  const cropOptions = ["Onion", "Corn", "Wheat"];
  const machineOptions = [
    { name: "Tractor", image: "tractor.png" },
    { name: "Plough", image: "plough.png" },
    { name: "Harvester", image: "harvester.png" },
  ];
  const animalOptions = ["Cow", "Goat", "Buffalo"];

  useEffect(() => {
    const currentLand = sellerProfile.lands[landIndex];

    setDistrict(currentLand.district);
    setTaluk(currentLand.taluk);
    setVillage(currentLand.village);
    setLandName(currentLand.landName);
    setAreaName(currentLand.areaName);
    setSurveyNo(currentLand.surveyNo);
    setHissaNo(currentLand.hissaNo);
    setAreaAcres(currentLand.areaAcres);
    setCrops([...currentLand.crops]);
    setMachines([...currentLand.machines]);
    setAnimals([...currentLand.animals]);

    setMachineSelect(
      machineOptions.filter((option) =>
        currentLand.machines.some((m) => m.name === option.name)
      )
    );
    setCropSelect("");
    setCropAcres("");
    setAnimalQty("");
  }, [landIndex]);

  const handleRemoveCrop = (index) => {
    const updated = [...crops];
    updated.splice(index, 1);
    setCrops(updated);
  };

  const handleRemoveAnimal = (index) => {
    const updated = [...animals];
    updated.splice(index, 1);
    setAnimals(updated);
  };

  return (
    <>
      <div className="right-content w-100">
        <StyledCard className="mt-3">
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              {/* Toggle Switch */}
              <Box sx={{ position: "absolute", top: 86, right: 37 }}>
                {
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    {editMode ? "Block User" : "Unblock User"}
                  </Typography>
                }
                <Switch
                  checked={editMode}
                  onChange={(e) => setEditMode(e.target.checked)}
                  color="primary"
                />
              </Box>

              {/* Edit Button (disabled when toggle is off) */}
              <Box sx={{ position: "absolute", top: 290, right: 42 }}>
                <Tooltip
                  title={editMode ? "Edit Profile" : "Edit Disabled"}
                  arrow
                  placement="left"
                >
                  <span>
                    <IconButton
                      onClick={() => openProfileModal(true)}
                      disabled={!editMode}
                      sx={{
                        color: editMode ? "primary.main" : "grey.400",
                        cursor: editMode ? "pointer" : "not-allowed",
                      }}
                    >
                      <FaEdit />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              {/* Avatar and Profile Info */}
              <Grid item>
                <Avatar
                  src={sellerProfile.profilePhoto}
                  sx={{ width: 100, height: 100 }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h5" fontWeight={600}>
                  {sellerProfile.name}
                </Typography>
                <Typography color="textSecondary">
                  {sellerProfile.email}
                </Typography>
                <Typography color="textSecondary">
                  {sellerProfile.phone}
                </Typography>
                <Typography color="textSecondary">
                  {sellerProfile.fpoGroup}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Address
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(sellerProfile.address).map(([label, value]) => (
                <Grid item xs={12} sm={6} md={4} key={label}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={500}
                    textTransform="capitalize"
                  >
                    {label.replace(/([A-Z])/g, " $1")}:{" "}
                    <Typography component="span" fontWeight={400}>
                      {value}
                    </Typography>
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </StyledCard>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Choose Land</InputLabel>
          <Select
            value={selectedLandIndex}
            label="Choose Land"
            onChange={(e) => setSelectedLandIndex(e.target.value)}
          >
            {sellerProfile.lands.map((land, index) => (
              <MenuItem value={index} key={land.landName}>
                {land.landName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <StyledCard>
          <CardContent>
            <Box sx={{ position: "absolute", right: 42 }}>
              <Tooltip
                title={editMode ? "Edit Land" : "Edit Disabled"}
                arrow
                placement="left"
              >
                <span>
                  <IconButton
                    onClick={() => {
                      setLandIndex(selectedLandIndex); // 👈 Sync with selected
                      openLandModal(true);
                    }}
                    disabled={!editMode}
                    sx={{
                      color: editMode ? "primary.main" : "grey.400",
                      cursor: editMode ? "pointer" : "not-allowed",
                    }}
                  >
                    <FaEdit />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <Typography variant="h6" mb={2}>
              Land Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <strong>District:</strong> {selectedLand.district}
              </Grid>
              <Grid item xs={12} sm={4}>
                <strong>Area Name:</strong> {selectedLand.areaName}
              </Grid>
              <Grid item xs={12} sm={4}>
                <strong>Survey No:</strong> {selectedLand.surveyNo}
              </Grid>
              <Grid item xs={12} sm={4}>
                <strong>Area (Acres):</strong> {selectedLand.areaAcres}
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Crop Details
            </Typography>
            <Grid container spacing={2}>
              {selectedLand.crops.map((crop, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar src={crop.image} variant="rounded" />
                    <div>
                      <Typography>{crop.name}</Typography>
                      <Typography variant="caption">
                        Acres: {crop.acres}
                      </Typography>
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Machine Details
            </Typography>
            <Grid container spacing={2}>
              {selectedLand.machines.map((machine, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar src={machine.image} variant="rounded" />
                    <Typography>{machine.name}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Animal Details
            </Typography>
            <Grid container spacing={2}>
              {selectedLand.animals.map((animal, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar src={animal.image} variant="rounded" />
                    <div>
                      <Typography>{animal.name}</Typography>
                      <Typography variant="caption">
                        Quantity: {animal.quantity}
                      </Typography>
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </StyledCard>
      </div>

      {/* Profile Edit Modal */}
      <Modal open={profileModal} onClose={() => openProfileModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Edit Profile</Typography>
          {["district", "taluk", "gramPanchayat", "village", "pincode"].map(
            (field) => (
              <TextField
                key={field}
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={address[field]}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, [field]: e.target.value }))
                }
                sx={{ mt: 2 }}
              />
            )
          )}

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select FPO Group</InputLabel>
            <Select
              value={fpo}
              label="Select FPO Group"
              onChange={(e) => {
                setFpo(e.target.value);
              }}
              required
            >
              {fpoNames.map((fpoName) => (
                <MenuItem key={fpoName} value={fpoName}>
                  {fpoName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={() => openProfileModal(false)}
          >
            Save Profile
          </Button>
        </Box>
      </Modal>

      {/* Land Edit Modal */}
      <Modal open={landModal} onClose={() => openLandModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" className="mb-3">
            Edit Land Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>District</InputLabel>
                <Select
                  value={district}
                  label="District"
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setTaluk("");
                    setVillage("");
                  }}
                  required
                >
                  {districtOptions.map((district) => (
                    <MenuItem key={district.value} value={district.value}>
                      {district.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth disabled={!district}>
                <InputLabel>Taluk</InputLabel>
                <Select
                  value={taluk}
                  label="Taluk"
                  onChange={(e) => {
                    setTaluk(e.target.value);
                    setVillage("");
                  }}
                  required
                >
                  {talukOptions.map((taluk) => (
                    <MenuItem key={taluk.value} value={taluk.value}>
                      {taluk.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth disabled={!taluk}>
                <InputLabel>Village</InputLabel>
                <Select
                  value={village}
                  label="Village"
                  onChange={(e) => setVillage(e.target.value)}
                  required
                >
                  {villageOptions.map((village) => (
                    <MenuItem key={village.value} value={village.value}>
                      {village.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Two fields per row */}
            <Grid item xs={6}>
              <TextField
                label="Land Name"
                fullWidth
                value={landName}
                onChange={(e) => setLandName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Area Name"
                fullWidth
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Survey No"
                fullWidth
                type="number"
                value={surveyNo}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value > 0 || e.target.value === "")
                    setSurveyNo(e.target.value);
                }}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Hissa No"
                fullWidth
                type="number"
                value={hissaNo}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value > 0 || e.target.value === "")
                    setHissaNo(e.target.value);
                }}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Area (Acres)"
                fullWidth
                type="number"
                value={areaAcres}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value > 0 || e.target.value === "")
                    setAreaAcres(e.target.value);
                }}
                inputProps={{ min: 0.01 }}
              />
            </Grid>
          </Grid>

          {/* Crop Section */}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Autocomplete
              options={cropOptions.filter(
                (c) => !crops.map((o) => o.name).includes(c)
              )}
              value={cropSelect}
              onChange={(e, v) => setCropSelect(v || "")}
              fullWidth
              renderInput={(params) => <TextField {...params} label="Crop" />}
            />
            <TextField
              label="Acres"
              type="number"
              value={cropAcres}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value > 0 || e.target.value === "")
                  setCropAcres(e.target.value);
              }}
              //onChange={(e) => setCropAcres(e.target.value)}
              sx={{ width: 100 }}
              inputProps={{ min: 0.01 }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                if (cropSelect && cropAcres && parseFloat(cropAcres) > 0) {
                  setCrops((prev) => [
                    ...prev,
                    { name: cropSelect, acres: parseFloat(cropAcres) },
                  ]);
                  setCropSelect("");
                  setCropAcres("");
                }
              }}
            >
              Add
            </Button>
          </Box>

          {crops.map((crop, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">
                • {crop.name} – {crop.acres} acres
              </Typography>
              <IconButton size="small" onClick={() => handleRemoveCrop(index)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          {/* Machines */}
          <Autocomplete
            multiple
            options={machineOptions}
            value={machineSelect}
            onChange={(e, newValue) => setMachineSelect(newValue)}
            getOptionLabel={(o) => o.name}
            renderInput={(params) => (
              <TextField {...params} label="Machines" sx={{ mt: 3 }} />
            )}
          />

          {/* Animals */}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Autocomplete
              options={animalOptions.filter(
                (a) => !animals.map((o) => o.name).includes(a)
              )}
              value={animalSelect}
              onChange={(e, v) => setAnimalSelect(v || "")}
              fullWidth
              renderInput={(params) => <TextField {...params} label="Animal" />}
            />
            <TextField
              label="Qty"
              type="number"
              value={animalQty}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value > 0 || e.target.value === "")
                  setAnimalQty(e.target.value);
              }}
              //onChange={(e) => setAnimalQty(e.target.value)}
              sx={{ width: 100 }}
              inputProps={{ min: 1 }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                if (animalSelect && animalQty > 0) {
                  setAnimals((prev) => [
                    ...prev,
                    { name: animalSelect, quantity: parseInt(animalQty) },
                  ]);
                  setAnimalSelect("");
                  setAnimalQty("");
                }
              }}
            >
              Add
            </Button>
          </Box>

          {animals.map((animal, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">
                • {animal.name} – {animal.quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleRemoveAnimal(index)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={() => openLandModal(false)}
          >
            Save Land
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SellerProfile;
