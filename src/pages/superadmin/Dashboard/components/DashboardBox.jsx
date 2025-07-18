import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";

const DashboardBox = () => {
  const theme = useTheme();

  const infoCards = [
    {
      title: "Total Users",
      data: [
        ["1000", "Total users"],
        ["5", "Currently online"],
        ["20", "Today installs"],
        ["50", "Last week installs"],
        ["75", "Last month installs"],
      ],
      color: "#b2dfdb",
    },
    {
      title: "Total Products",
      data: [
        ["50", "Total products"],
        ["Cow", "Most ads"],
        ["Tractor", "Most viewed"],
        ["Toys", "Least viewed"],
        ["Mobile", "Least ads"],
      ],
      color: "#f8bbd0",
    },
    {
      title: "Total Ads",
      data: [
        ["1000", "Total ads"],
        ["75", "Active ads"],
        ["10", "Today’s ads"],
        ["5000", "Total views"],
        ["60", "User ads"],
      ],
      color: "#bbdefb",
    },
    {
      title: "Total News",
      data: [
        ["1000", "Total news"],
        ["50", "Active news"],
        ["20", "Today news"],
        ["#5556", "Mostr viewed"],
        ["500", "Most viewed"],
      ],
      color: "#ffe082",
    },
  ];

  return (
    <Box sx={{ overflowX: "auto", pb: 1 }}>
      <Box
        sx={{
          display: "flex",
          gap: 3, // increases spacing between cards
          flexWrap: "nowrap",
          minWidth: "100%",
        }}
      >
        {infoCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: card.color,
              minWidth: 270,
              flexShrink: 0, // prevent shrinking in scroll
              //cursor: "pointer"
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {card.title}
              </Typography>
              {card.data.map((row, idx) => (
                <Box key={idx} display="flex" justifyContent="space-between">
                  <Typography variant="body1" color="textSecondary">{row[1]}</Typography>
                  <Typography variant="body2" >
                    {row[0]}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardBox;
