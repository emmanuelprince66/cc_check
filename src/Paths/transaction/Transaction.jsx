import React from "react";
import Navbar from "../../components/navbar/Navbar";
import {
  Card,
  Box,
  Container,
  Typography,
  CircularProgress,
  modalClasses,
} from "@mui/material";
import rightSuccess from "../../images/practise/greenSucess.svg";
import rightWrong from "../../images/practise/redWrong.svg";
import arrowLeft from "../../images/arrowLeft.svg";
import BackArrow from "../../components/backArrow/BackArrow";
import { Modal, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import copy from "../../images/copyIcon.svg";
import { useState, useEffect } from "react";
import downl from "../../images/practise/dowl.svg";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import date from "../../images/practise/date.svg";
import details from "../../images/practise/details.svg";
import "./Transaction.css";
import { AuthProvider } from "../../util/AuthContext";
import useTransactions from "../../hooks/useTransactions";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import NoResult from "../../components/NoResult";
import FormattedPrice from "../../components/FormattedPrice";
import { ToastContainer, toast } from "react-toastify";
import ClipboardJS from "clipboard";

const Transaction = () => {
  const transaction = useTransactions();
  console.log(transaction.data);
  const [open, setOpen] = React.useState(false);
  const [modalItem, setModalItem] = useState();

  const handleOpen = (item) => {
    setOpen(true);
    const itemFromId = transaction.data.queryResult.find(
      (data) => data.id === item
    );

    setModalItem(itemFromId);
  };
  console.log(modalItem);

  const handleClose = () => setOpen(false);

  const navigate = useNavigate();
  const currentTheme = useTheme();

  const formattedTime = (oldTime) => {
    const dateTimeString = oldTime;
    const dateTime = new Date(dateTimeString);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const formattedString = dateTime
      .toLocaleString("en-US", options)
      .replace(/, /g, " | ");

    return formattedString;
  };
  const copyToClipboard = async (id) => {
    try {
      if (id) {
        await navigator.clipboard.writeText(id);
        notify("Account Number Copied To Clipboard");
      }
    } catch (err) {
      console.error("Copy to clipboard failed:", err);
    }
  };
  const notify = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const handleDownload = () => {
    // Select the element with ID "receipt"
    const receipt = document.querySelector("#reciept");
    console.log(receipt);

    // Convert the element to a JPEG image using html2canvas and lower quality setting
    html2canvas(receipt, { useCORS: true, dpi: 150 }).then((canvas) => {
      // Get the image data URL from the canvas with JPEG format and lower quality (adjust quality as needed)
      const imgData = canvas.toDataURL("image/jpeg", 0.8); // Adjust the quality (0.0 to 1.0)

      // Create a new jsPDF instance with a customized page size (use "pt" for points)
      const pdf = new jsPDF({
        orientation: "portrait", // "portrait" or "landscape"
        unit: "pt", // Points as the unit of measurement
        format: [canvas.width * 0.75, canvas.height * 0.75], // Reduce page size to 75% of the canvas size
      });

      // Add the image to the PDF at the top-left corner
      pdf.addImage(imgData, "JPEG", 0, 0);

      // Save the PDF with the name "receipt.pdf"
      pdf.save("receipt.pdf");
    });
  };

  return (
    <AuthProvider>
      <Box
        sx={{
          maxWidth: "31%",
          mx: "auto",
          marginTop: "1rem",
          maxWidth: { xs: "100%", sm: "100%", md: "31%" },
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            mx: "auto",
            width: { xs: "90%", sm: "70%", md: "100%" },
            padding: 0,
            marginBottom: "5rem",
          }}
        >
          <div>
            <BackArrow destination="/home" />
          </div>

          {transaction.data ? (
            transaction.data.queryResult.length == 0 ? (
              <NoResult
                notification="You Have No Recent Transactions"
                smallText="Records of transactions you perform will appear here"
                buttonText="Scan"
                linkText="/home"
              />
            ) : (
              transaction.data.queryResult.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => handleOpen(item.id)}
                  sx={{
                    display: "flex",
                    cursor: "pointer",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                    padding: "1rem",
                    width: { xs: "100%", sm: "100%", md: "100%" },
                    mx: "auto",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <img
                      src={
                        item.transactionStatus === "SUCCESS"
                          ? rightWrong
                          : rightSuccess
                      }
                      alt="img"
                    />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        justifyContent: "start",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "raleWay",
                          color:
                            item.transactionType != "DEBIT"
                              ? "#008000"
                              : "#DC0019",
                        }}
                      >
                        <FormattedPrice amount={item.amount} />
                      </Typography>
                      <Typography
                        variant="h2"
                        sx={{
                          fontFamily: "raleWay",
                          color:
                            currentTheme.palette.type === "light"
                              ? "#1E1E1E"
                              : "#EEEEEE",
                          fontWeight: 600,
                          fontSize: "14px",
                          lineHeight: "16.18px",
                        }}
                      >
                        {item.transferTo.firstName}
                      </Typography>

                      <Typography
                        variant="h2"
                        sx={{
                          fontFamily: "raleWay",
                          color:
                            currentTheme.palette.type === "light"
                              ? "#727272"
                              : "#EEEEEE",
                          fontWeight: 400,
                          fontSize: "12px",
                          lineHeight: "14.18px",
                        }}
                      >
                        {formattedTime(item.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <img src={arrowLeft} alt="a-left" />
                  </Box>
                </Card>
              ))
            )
          ) : (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "10rem",
              }}
            >
              <CircularProgress size="4rem" color="error" />
            </Box>
          )}

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="scale-in-center"
          >
            <Card
              sx={{
                position: "absolute",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                bottom: 0,
                width: { xs: "100%", sm: "70%", lg: "25%" },
                left: { xs: "0", sm: "14%", lg: "37%" },
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  borderBottom: "1px solid #CDCDCD",
                  paddingBottom: "1rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      color:
                        currentTheme.palette.type === "light"
                          ? "#1E1E1E"
                          : "#EEEEEE",
                      fontWeight: 600,
                      fontFamily: "raleWay",
                      fontSize: "16px",
                    }}
                  >
                    TRANSACTION RECEIPT
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      marginTop: "10px",
                      gap: "2px",
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          currentTheme.palette.type === "light"
                            ? "#C57600"
                            : "#C57600",
                        fontWeight: 500,
                        fontFamily: "raleWay",
                        lineHeight: "20px",
                        fontSize: "10px",
                      }}
                    >
                      {modalItem ? modalItem.id : ""}
                    </Typography>

                    <Box
                      onClick={() =>
                        copyToClipboard(modalItem && modalItem?.id)
                      }
                      sx={{
                        padding: "4px 8px 4px 8px",
                        background: "#DC00191A",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img src={copy} alt="copy" />
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    padding: "10px",
                    border: "1px solid #CDCDCD",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                  }}
                  onClick={handleDownload}
                >
                  <GetAppRoundedIcon />
                </Box>
              </Box>
              {/* data */}

              {/* Recipt start */}

              <Box
                sx={{
                  width: "100%",
                }}
                id="reciept"
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    my: "0.5rem",
                  }}
                >
                  {modalItem ? formattedTime(modalItem.createdAt) : ""}
                </Box>
                {/* Transaction Details */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      justifyContent: "start",
                      gap: "15px",
                      background: "#F8F8F8",
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "start",
                        gap: "4px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "raleWay",
                          fontWeight: "600",
                          fontSize: "12px",
                          color:
                            currentTheme.palette.type === "light "
                              ? "#000"
                              : "#000",
                        }}
                      >
                        RECIPIENT :
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "raleWay",
                          fontWeight: "1000",
                          fontSize: "16px",
                          color:
                            currentTheme.palette.type === "light "
                              ? "#000"
                              : "#000",
                        }}
                      >
                        {modalItem && modalItem.approvedBy.firstName}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "start",
                        gap: "4px",
                        width: "100%",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "raleWay",
                          fontWeight: "400",
                          fontSize: "12px",
                          color:
                            currentTheme.palette.type === "light "
                              ? "#000"
                              : "#000",
                        }}
                      >
                        ATTENDANT :
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "raleWay",
                          fontWeight: "900",
                          fontSize: "16px",
                          color:
                            currentTheme.palette.type === "light "
                              ? "#000"
                              : "#000",
                        }}
                      >
                        {modalItem && modalItem.transferTo.firstName}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "start",
                        gap: "4px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "raleWay",
                          fontWeight: "400",
                          fontSize: "12px",
                          color:
                            currentTheme.palette.type === "light "
                              ? "#000"
                              : "#000",
                        }}
                      >
                        AMOUNT PAID :
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "raleWay",
                          fontWeight: "900",
                          fontSize: "16px",
                          color:
                            currentTheme.palette.type === "light "
                              ? "#000"
                              : "#000",
                        }}
                      >
                        {modalItem ? (
                          <FormattedPrice amount={modalItem.amount} />
                        ) : (
                          ""
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Recipt end */}
            </Card>
          </Modal>
        </Container>
        {/* NAVBAR */}

        <Navbar />
        <ToastContainer />
      </Box>
    </AuthProvider>
  );
};

export default Transaction;
