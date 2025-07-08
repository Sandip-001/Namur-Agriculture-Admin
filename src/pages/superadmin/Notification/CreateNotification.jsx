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
import dayjs from "dayjs";

const CreateNotification = () => {
  const [targetType, setTargetType] = useState("all");
  const [districts, setDistricts] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [schedule, setSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(dayjs());
  const [scheduleTime, setScheduleTime] = useState(dayjs());

  useEffect(() => {
    fetch("https://api.countrystatecity.in/v1/countries/IN/states/KA/cities", {
      headers: {
        "X-CSCAPI-KEY":
          "dHFLWG1XQ3J0OUtTMlRmVTlZUGptRHlUSUxmaHhtUlB0NFMxc1gzaA==",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log("Raw API response:", data);
        const cityNames = data.map((city) => city.name);
        //console.log("Mapped city names:", cityNames);
        setDistricts(cityNames);
      })
      .catch((err) => console.error("Failed to fetch cities", err));
  }, []);


  const handledistChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDistricts(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = () => {
    const scheduleDateTime = schedule
      ? dayjs(
          `${dayjs(scheduleDate).format("YYYY-MM-DD")} ${dayjs(
            scheduleTime
          ).format("HH:mm")}`
        )
      : null;

    const payload = {
      targetType,
      districts: selectedDistricts,
      title,
      message,
      sendNow: !schedule,
      scheduleDateTime,
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
            </RadioGroup>
          </FormControl>

          {targetType === "district" && (
            <FormControl fullWidth>
              <InputLabel>Select District</InputLabel>
              <Select
                multiple
                value={selectedDistricts}
                onChange={handledistChange}
                input={<OutlinedInput label="District" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {districts.map((dist) => (
                  <MenuItem key={dist} value={dist}>
                    <Checkbox checked={selectedDistricts.includes(dist)} />
                    <ListItemText primary={dist} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            label="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notification Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            margin="normal"
          />

          <FormControlLabel
            control={
              <Switch
                checked={schedule}
                onChange={(e) => setSchedule(e.target.checked)}
              />
            }
            label="Schedule Notification"
            sx={{ mt: 2 }}
          />

          {schedule && (
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Select Date"
                  value={scheduleDate}
                  onChange={(newDate) => setScheduleDate(newDate)}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Select Time"
                  value={scheduleTime}
                  onChange={(newTime) => setScheduleTime(newTime)}
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>
          )}

          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
            >
              {schedule ? "Schedule Notification" : "Send Now"}
            </Button>
          </Box>
        </Box>
      </div>
    </LocalizationProvider>
  );
};

export default CreateNotification;
