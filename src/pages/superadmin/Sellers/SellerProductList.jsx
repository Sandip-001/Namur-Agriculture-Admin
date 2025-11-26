import React, { useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Switch, FormControlLabel } from "@mui/material";
import { styled } from "@mui/system";
import corn from "../../../assets/corn.png";
import onion from "../../../assets/onion.png";
import goat from "../../../assets/goat.png";
import cow from "../../../assets/cow.png";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(2),
  textAlign: "center",
  background: "#fff",
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const ProductImage = styled("img")({
  width: 100,
  height: 100,
  //borderRadius: "50%",
  objectFit: "cover",
  marginBottom: 10,
});

const SellerProductCard = ({
  image,
  name,
  category,
  quantity,
  unit,
  price,
  description,
}) => {
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="center">
          <ProductImage src={image} alt={name} />
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Category: <b>{category}</b>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Quantity:{" "}
          <b>
            {quantity} {unit}
          </b>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Price: <b>₹{price}</b>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

const SellerProductList = () => {
  const [toggle, setToggle] = useState(true);

  const products = [
    {
      image: corn,
      name: "Corn",
      category: "Sweet Corn",
      quantity: 10,
      unit: "kg",
      price: 250,
      description: "Handpicked sweet corn, perfect for boiling, roasting, or adding to salads. Naturally rich in flavor and nutrients for a healthy diet.",
    },
    {
      image: onion,
      name: "Onion",
      category: "Bangalore Rose Onion",
      quantity: 50,
      unit: "kg",
      price: 50,
      description: "Freshly harvested Bangalore Rose Onions known for their distinct aroma and sharp flavor—ideal for enhancing your curries and chutneys.",
    },
    {
      image: cow,
      name: "Cow",
      category: "Javari Cattle",
      quantity: 2,
      unit: "pieces",
      price: 40000,
      description: "Premium Javari breed cattle known for high milk yield and strong immunity. Perfect for dairy farming and sustainable livestock management.",
    },
    {
      image: corn,
      name: "Corn",
      category: "Sweet Corn",
      quantity: 10,
      unit: "kg",
      price: 250,
      description: "Handpicked sweet corn, perfect for boiling, roasting, or adding to salads. Naturally rich in flavor and nutrients for a healthy diet.",
    },
    {
      image: onion,
      name: "Onion",
      category: "Bangalore Rose Onion",
      quantity: 50,
      unit: "kg",
      price: 50,
      description: "Freshly harvested Bangalore Rose Onions known for their distinct aroma and sharp flavor—ideal for enhancing your curries and chutneys.",
    },
    {
      image: cow,
      name: "Cow",
      category: "Javari Cattle",
      quantity: 2,
      unit: "pieces",
      price: 40000,
      description: "Premium Javari breed cattle known for high milk yield and strong immunity. Perfect for dairy farming and sustainable livestock management.",
    },
  ];

  return (
    <div className="right-content w-100">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Sandip's Selling Products</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={toggle}
              onChange={() => setToggle(!toggle)}
              sx={{
                '& .MuiSwitch-switchBase': {
                  transform: 'scale(1.4)',
                },
                '& .MuiSwitch-thumb': {
                  backgroundColor: '#05a415',
                },
                '& .MuiSwitch-track': {
                  backgroundColor: toggle ? '#099216' : '#ccc',
                  opacity: 1,
                }
              }}
            />
          }
          label={<Typography fontWeight={600}>Block Ads</Typography>}
          labelPlacement="start"
        />
      </Box>

      <Grid container spacing={3} columns={{ xs: 1, sm: 2, md: 3 }}>
        {products.map((product, index) => (
          <Grid item key={index} size={1}>
            <SellerProductCard {...product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SellerProductList;