import React from "react";
import backArrow from "../../images/bb.svg";
import "./BackArrow.css";
import { Link } from "react-router-dom";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { useTheme } from "@mui/material";
const BackArrow = ({ destination }) => {
  const currentTheme = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "self-end" }}>
      <Link to={destination}>
        <div className="gpt3__paybills_back">
          <ChevronLeftRoundedIcon
            sx={{
              color: currentTheme.palette.type === "light" ? "#000" : "#fff",
            }}
          />
        </div>
      </Link>
    </div>
  );
};

export default BackArrow;
