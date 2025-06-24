import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "@mui/system";
import man1 from "../../../assets/man1.png";
import onion from "../../../assets/onion.png";
import goat from "../../../assets/goat.png";
import cow from "../../../assets/cow.png";
import tractor from "../../../assets/tractor.png";
import plow from "../../../assets/plow.png";
import corn from "../../../assets/corn.png";


const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  marginBottom: theme.spacing(4),
}));

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
  lands: [
    {
      landName: "Land A",
      areaName: "Green Valley",
      surveyNo: "123/1",
      areaAcres: 2.5,
      crops: [
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
      landName: "Land B",
      areaName: "Sunset Field",
      surveyNo: "456/2",
      areaAcres: 1.8,
      crops: [
        { name: "Corn", image: corn, acres: 1.8 },
      ],
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

  return (
    <div className="right-content w-100">
      <StyledCard>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
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
          <Typography variant="h6" mb={2}>
            Land Details
          </Typography>
          <Grid container spacing={2}>
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
  );
};

export default SellerProfile;
