import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Typography,
  Card,
  Skeleton,
  Avatar,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getMenu } from "../../helpers/getMenu";
import useMenu from "../../hooks/useMenu";
import useRestaurant from "../../hooks/useRestaurant";
import Restaurant from "../../components/restaurant/index";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import {
  clearMerchantState,
  clearStateForOTD,
  initOTD,
  setLandmarks,
} from "../../util/slice/merchantSlice";
import clockIcon from "../../assets/clock.svg";
import { useDispatch } from "react-redux";
import BackArrow from "../../components/backArrow/BackArrow";
import { getLandmarks } from "../../hooks/useGetLandMarks";
import card1 from "../../assets/Card/card1.svg";
import card2 from "../../assets/card2.svg";
import { useNavigate } from "react-router-dom";
import { convertTo12HourFormat } from "../../helpers/getAmPmFormat";
import useOTDResById from "../../hooks/useOTDResById";
const RestaurantPage = () => {
  const params = useParams();
  const { myLocation } = useSelector((state) => state.merchantReducer);
  const pep = useOTDResById(params?.id);
  const dispatch = useDispatch();
  const menu = useMenu(params.id);
  const [finalObject, setFinalObject] = useState({});
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function call() {
      let load = {};
      for (let obj in pep?.data) {
        if (pep?.data[obj] !== null) {
          load[obj] = pep?.data[obj];
        }
      }
      for (let obj in menu?.data) {
        if (menu?.data[obj] !== null) {
          load[obj] = menu?.data[obj];
        }
      }
      setFinalObject(load);
      console.log(load);
    }
    call();
  }, [pep?.data, menu?.data]);

  const [data, setData] = useState({});
  useEffect(() => {
    const resCoords = {
      lat: finalObject?.latitude,
      long: finalObject?.longitude,
    };
    const userCoords = {
      lat: myLocation?.latitude,
      long: myLocation?.longitude,
    };
    async function getData() {
      const res = await getLandmarks({ resCoords, userCoords });
      if (res && res?.data) {
        setData(res?.data);
      }
    }
    getData();
  }, [
    finalObject?.latitude,
    finalObject?.longitude,
    myLocation?.latitude,
    myLocation?.longitude,
  ]);

  useEffect(() => {
    function openStatus(openTime, closeTime) {
      if (!openTime || !closeTime) {
        return "Invalid Time";
      }

      const time = new Date();
      const hrs = time.getHours();
      const mins = time.getMinutes();

      const [openHours, openMinutes] = openTime.split(":");
      const [closeHours, closeMinutes] = closeTime.split(":");
      const isWithinTimeRange =
        (hrs > Number(openHours) ||
          (hrs === Number(openHours) && mins > Number(openMinutes))) &&
        (hrs < Number(closeHours) + 12 ||
          (hrs === Number(closeHours) + 12 && mins <= Number(closeMinutes)));
      if (isWithinTimeRange) {
        return "Open";
      } else {
        return "Closed";
      }
    }

    const result = openStatus(
      finalObject?.openingTime,
      finalObject?.closingTime
    );

    setStatus(result);
    dispatch(setLandmarks(finalObject?.landmarks));
  }, [finalObject, setStatus]);

  useEffect(() => {
    dispatch(initOTD(true));
    dispatch(clearStateForOTD());
  }, []);
  console.log(finalObject);
  return (
    <div className="gpt3__restaurant">
      <Container
        sx={{
          padding: "0px",
          display: "flex",
          marginTop: "-1em",
          gap: "2em",
          flexDirection: "column",
        }}
      >
        <Box sx={{ height: "20vh" }}>
          {finalObject?.image ? (
            <Avatar
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "4px 4px 0 0",
                objectFit: "cover",
              }}
              variant="rounded"
              alt="Menu Item Image"
              src={finalObject?.image}
            />
          ) : (
            <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
          )}{" "}
        </Box>
        <Box
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: "10px",
            left: "10px",
          }}
        >
          <Box
            sx={{
              background: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "5px",
            }}
          >
            <ChevronLeftRoundedIcon
              sx={{
                color: "white",
              }}
            />
          </Box>
        </Box>
        <Card
          sx={{
            padding: ".5em ",
            width: { xs: "90%", md: "90%" },
            margin: " 0 auto",
            insetInline: "0",
            zIndex: "9",
            marginTop: "-4em",
            boxShadow:
              " 0px 2px 1px -1px hsla(0, 0%, 0%, 0.05), 0px 1px 1px 0px hsla(0, 0%, 0%, 0.05), 0px 1px 3px 0px hsla(0, 0%, 0%, 0.05)",
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: ".5em",
              padding: ".5em",
            }}
          >
            <Typography fontSize={"22px"} fontWeight={600}>
              {" "}
              {finalObject.companyName}{" "}
            </Typography>
            <Box sx={{ display: "flex", gap: ".5em" }}>
              <Avatar sx={{ width: "20px", height: "20px" }} src={clockIcon} />
              <Typography sx={{ fontSize: "13px" }}>
                {convertTo12HourFormat(finalObject?.openingTime) +
                  "AM" +
                  "-" +
                  convertTo12HourFormat(finalObject?.closingTime) +
                  "PM"}{" "}
                <span
                  style={{
                    background: `${
                      status === "Closed"
                        ? "#ff000030"
                        : "hsla(120, 100%, 25%, 0.1)"
                    } `,
                    color: `${
                      status === "Closed"
                        ? "var(--primary-red)"
                        : "var(--currency-green)"
                    } `,
                    padding: " .2em .4em",
                    marginLeft: ".5em",
                    height: "fit-content",
                    borderRadius: ".3em",
                    fontWeight: "600",
                  }}
                >
                  {" "}
                  {status}
                </span>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: ".5em" }}>
              <Avatar sx={{ width: "20px", height: "20px" }} src={card2} />
              <Typography sx={{ fontSize: "13px", width: "100%" }}>
                {" "}
                {data && data?.destination_addresses ? (
                  <>
                    <span> {data?.destination_addresses[0]}</span>
                    &nbsp;
                    <span>
                      ({data?.rows[0].elements[0].distance?.text} away)
                    </span>
                  </>
                ) : (
                  <Skeleton variant="text" width={"100%"} height={30} />
                )}{" "}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: ".5em" }}>
              <Avatar sx={{ width: "20px", height: "20px" }} src={card1} />
              <Typography sx={{ fontSize: "13px" }}>
                {" "}
                Delivery Available
              </Typography>
            </Box>
          </Box>
        </Card>
        <Restaurant status={status === "Closed" ? "Closed" : ""} />
      </Container>
    </div>
  );
};
export default RestaurantPage;
