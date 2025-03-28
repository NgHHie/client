import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  LightOutlined,
  WindPowerOutlined,
  AcUnitOutlined,
} from "@mui/icons-material";
import {
  Box,
  useTheme,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import OverviewChart from "components/OverviewChart";
import StatBox from "components/StatBox";
import SwitchBox from "components/SwitchBox";
import socketIOClient from "socket.io-client";
import { useGetSalesQuery } from "../../state/api";
import { NotificationContext } from "../../context/NotificationContext";

const host = "http://localhost:5001";
const socket = socketIOClient.connect(host);
localStorage.setItem("count", localStorage.getItem("count") || 0);
const Dashboard = () => {
  const [count, setCount] = useState(0); // Khởi tạo state để lưu trữ giá trị

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/count");
        const data = await response.json();
        // console.log();
        setCount(data.data.Count); // Giả sử API trả về { count: giá trị }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchCount(); // Gọi hàm fetch khi component mount
  }, []);

  const { toggleNotification, closeNotification } =
    useContext(NotificationContext);

  const apiData = useGetSalesQuery();
  const [stats, setStats] = useState({
    temper: localStorage.getItem("temper") || "--°C",
    humid: localStorage.getItem("humid") || "--%",
    light: localStorage.getItem("light") || "--",
  });

  const [on, setOns] = useState({
    message: "",
    light: localStorage.getItem("light_status") || "0",
    fan: localStorage.getItem("fan_status") || "0",
    air: localStorage.getItem("air_status") || "0",
    hiep: "0",
  });

  // console.log("apidata: ", apiData.data);
  const [dataDb, setData] = useState(apiData.data);
  const dataDbRef = useRef(dataDb); // Tạo ref để lưu giá trị mới nhất
  const location = useLocation();

  useEffect(() => {
    apiData.refetch();
  }, [location]);
  useEffect(() => {
    dataDbRef.current = dataDb;
  }, [dataDb]);
  useEffect(() => {
    if (apiData) {
      setData(apiData.data);
    }
  }, [apiData]);
  // console.log(dataDb);

  useEffect(() => {
    socket.on("mqttMessage", (data) => {
      if (data.topic == "home/sensor") {
        try {
          // Parse MQTT message to JSON

          const messagejson = JSON.parse(data.message);
          console.log(messagejson);
          if (parseInt(messagejson.new_sensor) >= 60) {
            let currentCount = parseInt(localStorage.getItem("count")) || 0; // Chuyển chuỗi thành số, hoặc đặt mặc định là 0
            localStorage.setItem("count", currentCount + 1); // Tăng giá trị lên 1
          }

          const currentDataDb = dataDbRef.current; // Sử dụng giá trị mới nhất từ ref

          if (currentDataDb) {
            const updatedData = {
              temper: [...currentDataDb.temper.slice(0, -1)], // Xóa phần tử cuối cùng
              humid: [...currentDataDb.humid.slice(0, -1)], // Xóa phần tử cuối cùng
              light: [...currentDataDb.light.slice(0, -1)], // Xóa phần tử cuối cùng
            };

            updatedData.temper.unshift({
              GiaTri: messagejson.temperature,
              ThoiGian: messagejson.time,
            });
            updatedData.humid.unshift({
              GiaTri: messagejson.humidity,
              ThoiGian: messagejson.time,
            });
            updatedData.light.unshift({
              GiaTri: messagejson.light_level,
              ThoiGian: messagejson.time,
            });

            setData(updatedData);
            const temper = updatedData.temper?.[0]?.GiaTri;
            const light = updatedData.light?.[0]?.GiaTri;

            if (temper >= 45 || temper < 10 || light >= 3000) {
              toggleNotification("Nhà bạn đang bất ổn!!", "warning");
            } else {
              closeNotification();
            }
          }

          // Extract the values and round the temperature
          const newSensor = messagejson.new_sensor || "--";
          const newTemper = Math.round(messagejson.temperature) || "--";
          const newHumid = messagejson.humidity || "--";
          const newLight = messagejson.light_level || "--";
          const light_status = messagejson.light || "0";
          const fan_status = messagejson.fan || "0";
          const air_status = messagejson.air_conditioner || "0";
          const hiep_status = localStorage.getItem("hiep_status") || "0";

          let message = "";

          // Kiểm tra nhiệt độ
          if (newTemper < 10) {
            message += "Nhiệt độ rất lạnh. ";
          } else if (newTemper >= 10 && newTemper < 15) {
            message += "Thời tiết mát mẻ. ";
          } else if (newTemper >= 15 && newTemper < 20) {
            message += "Nhiệt độ dễ chịu. ";
          } else if (newTemper >= 20 && newTemper < 25) {
            message += "Thời tiết ấm áp. ";
          } else if (newTemper >= 25 && newTemper < 30) {
            message += "Trời hơi nóng. ";
          } else if (newTemper >= 30 && newTemper < 35) {
            message += "Trời nóng. ";
          } else if (newTemper >= 35 && newTemper < 45) {
            message += "Trời rất nóng. ";
          } else {
            message += "Nhiệt độ cực cao! Cần chú ý giữ mát. ";
          }

          // Kiểm tra độ ẩm
          if (newHumid < 30) {
            message += "Không khí khô. ";
          } else if (newHumid >= 30 && newHumid < 60) {
            message += "Độ ẩm vừa phải. ";
          } else if (newHumid >= 60 && newHumid <= 100) {
            message += "Không khí ẩm. ";
          }

          // Kiểm tra ánh sáng
          if (newLight < 1000) {
            message += "Ánh sáng thấp. ";
          } else if (newLight >= 1000 && newLight < 3000) {
            message += "Ánh sáng lý tưởng. ";
          } else if (newLight >= 3000 && newLight <= 4095) {
            message += "Ánh sáng rất mạnh. ";
          }

          // Đưa ra các kết luận dựa trên sự kết hợp của các yếu tố
          if (
            newTemper >= 15 &&
            newTemper <= 25 &&
            newHumid >= 30 &&
            newHumid <= 60 &&
            newLight >= 1000 &&
            newLight < 3000
          ) {
            message +=
              "Hôm nay nhà bạn rất dễ chịu, không quá nóng và sáng vừa đủ.";
          } else if (newTemper >= 30 && newHumid >= 60 && newLight >= 3000) {
            message +=
              "Trời rất oi bức với nhiệt độ cao, độ ẩm cao và ánh sáng mạnh. Bạn nên giữ nhà mát.";
          } else if (newTemper < 10 && newHumid >= 60 && newLight >= 3000) {
            message +=
              "Thời tiết lạnh và ẩm, ánh sáng mạnh. Hãy giữ ấm và thông gió cho nhà.";
          }

          setStats({
            message: `${newSensor}`,
            temper: `${newTemper}°C`,
            humid: `${newHumid}%`,
            light: `${newLight}`,
          });

          setOns({
            light: light_status,
            fan: fan_status,
            air: air_status,
            hiep: localStorage.getItem("hiep_status"),
          });

          // Save data to localStorage
          localStorage.setItem("temper", `${newTemper}°C`);
          localStorage.setItem("humid", `${newHumid}%`);
          localStorage.setItem("light", newLight);

          localStorage.setItem("light_status", light_status);
          localStorage.setItem("fan_status", fan_status);
          localStorage.setItem("air_status", air_status);
          // localStorage.setItem("hiep_status", hiep_status);
        } catch (error) {
          console.error("Error parsing MQTT message:", error);
        }
      } else {
        const messagejson = JSON.parse(data.message);
        if (data.topic == "light_status") {
          localStorage.setItem("light_status", messagejson.status);
          setOns({
            light: messagejson.status,
            fan: localStorage.getItem("fan_status") || "0",
            air: localStorage.getItem("air_status") || "0",
            hiep: localStorage.getItem("hiep_status") || "0",
          });
        } else if (data.topic == "fan_status") {
          localStorage.setItem("fan_status", messagejson.status);
          setOns({
            fan: messagejson.status,
            light: localStorage.getItem("light_status") || "0",
            air: localStorage.getItem("air_status") || "0",
            hiep: localStorage.getItem("hiep_status") || "0",
          });
        } else if (data.topic == "air_status") {
          localStorage.setItem("air_status", messagejson.status);
          setOns({
            air: messagejson.status,
            light: localStorage.getItem("light_status") || "0",
            fan: localStorage.getItem("fan_status") || "0",
            hiep: localStorage.getItem("hiep_status") || "0",
          });
        } else if (data.topic == "hiep_status") {
          localStorage.setItem("hiep_status", messagejson.status);
          setOns({
            hiep: messagejson.status,
            air: localStorage.getItem("air_status") || "0",
            light: localStorage.getItem("light_status") || "0",
            fan: localStorage.getItem("fan_status") || "0",
          });
        }
      }
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("mqttMessage");
    };
  }, []);

  // const []

  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [view, setView] = useState(localStorage.getItem("view") || "temper");
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header
          title="TỔNG QUAN"
          subtitle="Dữ liệu tổng quan về ngôi nhà của bạn"
        />
      </FlexBetween>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox title="Chung" value={stats.message} description="hiep" />
        <StatBox
          title="Nhiệt độ"
          //value={data && data.todayStats.totalSales}
          value={stats.temper}
          description="temper"
        />
        <StatBox
          title="Độ ẩm"
          //value={data && data.thisMonthStats.totalSales}
          value={stats.humid}
          description="humid"
        />
        <StatBox
          title="Ánh sáng"
          //value={data && data.yearlySalesTotal}
          value={stats.light}
          description="light"
        />
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.primary[500]}
          p="1.5rem"
          borderRadius="1.5rem"
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)" // 2 columns
          gridTemplateRows="repeat(8, 1fr)" // 8 rows
          gap="calc(1rem + 2%)"
          sx={{
            boxShadow: "0px 4px 6px rgba(255, 255, 255, 0.5)",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: theme.palette.primary[500],
            },
            "@media (max-width: 600px)": {
              gridTemplateColumns: "1fr", // 1 column on smaller screens
            },
          }}
        >
          <SwitchBox title="Đèn" status={on.light} icon={<LightOutlined />} />
          <SwitchBox
            title="Quạt"
            status={on.fan}
            icon={<WindPowerOutlined />}
          />
          <SwitchBox
            title="Điều hòa"
            status={on.air}
            icon={<AcUnitOutlined />}
          />

          <SwitchBox
            title={`Cảnh báo ${count}`}
            status={on.hiep}
            icon={<AcUnitOutlined />}
          />
          {/* <SwitchBox
            title="Thêm"
            //value={data && data.yearlySalesTotal}
            icon={<AddOutlined />}
          /> */}
        </Box>
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="1.5rem"
          sx={{
            boxShadow: "0px 4px 6px rgba(255, 255, 255, 0.5)",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: theme.palette.primary[500],
            },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box height="95%">
            <OverviewChart
              view={view}
              isDashboard={true}
              dataDb={dataDb}
              // isLoading={false}
            />
          </Box>

          <Box
            display="flex"
            sx={{
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Button
              onClick={() => {
                setView("temper");
                localStorage.setItem("view", "temper");
              }}
              sx={{
                backgroundColor: theme.palette.secondary[300],
                textTransform: "none",
                padding: "0 0",
                "&:hover": {
                  backgroundColor: theme.palette.secondary[400],
                },
              }}
            >
              <Typography variant="h7">Nhiệt độ</Typography>
            </Button>
            <Button
              onClick={() => {
                setView("humid");
                localStorage.setItem("view", "humid");
              }}
              sx={{
                backgroundColor: theme.palette.xanhduong[300],
                textTransform: "none",
                padding: "0 0",
                "&:hover": {
                  backgroundColor: theme.palette.xanhduong[400],
                },
              }}
            >
              <Typography variant="h7">Độ ẩm</Typography>
            </Button>
            <Button
              onClick={() => {
                setView("light");
                localStorage.setItem("view", "light");
              }}
              sx={{
                backgroundColor: theme.palette.vang[300],
                textTransform: "none",
                padding: "0 0",
                "&:hover": {
                  backgroundColor: theme.palette.vang[400],
                },
              }}
            >
              <Typography variant="h7">Ánh sáng</Typography>
            </Button>
          </Box>
        </Box>

        {/* ROW 2 */}
      </Box>
    </Box>
  );
};

export default Dashboard;
