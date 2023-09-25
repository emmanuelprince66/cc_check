import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./HomeCard.css";
import scanIcon from "../../images/scanIcon.png";
import walletIcon from "../../images/walletIcon.png";
import locationIcon from "../../images/locationIcon.png";
import { Box } from "@mui/material";
import bookIcon from "../../images/bookIcon.png";
import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material";

const cards = [
  {
    id: 1,
    image: scanIcon,
    title: "Scan ",
    small: "Click to start",
    pathname: "/mainScanner",
  },
  {
    id: 2,
    image: locationIcon,
    title: " Order",
    small: "Order to Doorstep",
    pathname: "/order-out",
  },
  {
    id: 3,
    image: walletIcon,
    title: "Wallet",
    small: "Fund your wallet",
    pathname: "/wallet",
  },
  {
    id: 4,
    image: bookIcon,
    title: "Status ",
    small: "View your order  status",
    pathname: "/orders",
  },
];

const HomeCard = () => {
  const currentTheme = useTheme();

  return (
    <div className="gpt3__home-card">
      {cards.map((card) => {
        return (
          <Card
            variant="outlined"
            key={card.id}
            sx={{
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: "0px 2px 40px rgba(0, 0, 0, 0.1)",
              background:
                currentTheme.palette.type === "light" ? "#fff" : "#1E1E1E",
            }}
          >
            <Link to={card.pathname}>
              <CardContent>
                <Box
                  sx={{
                    width: "50%",
                    height: "50%",
                    mx: "auto",
                  }}
                >
                  <img
                    src={card.image}
                    className="home-card-img"
                    alt="card-title"
                  />
                </Box>

                <Typography
                  sx={{
                    color:
                      currentTheme.palette.type === "light"
                        ? "#1e1e1e"
                        : "#ffff",
                    fontFamily: "raleWay",
                    fontWeight: "600",
                  }}
                >
                  {card.title}{" "}
                </Typography>
                <Typography
                  sx={{
                    color:
                      currentTheme.palette.type === "light"
                        ? "#1e1e1e"
                        : "#ffff",
                    fontFamily: "raleWay",
                    fontWeight: "500",
                    fontSize: "10px",
                  }}
                >
                  {card.small}{" "}
                </Typography>
              </CardContent>
            </Link>
          </Card>
        );
      })}
    </div>
  );
};

export default HomeCard;
