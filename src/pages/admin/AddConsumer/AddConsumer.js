import React, { useEffect } from "react";
import {
  Button,
  InputAdornment,
  TextField as MuiTextField,
} from "@mui/material";
import useForm from "../../../hooks/useForm";
import WidgetComponent from "../../../components/WidgetComponent/WidgetComponent";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import StyledButton from "../../../components/StyledButton";
import useNotificationStore from "../../../stores/useNotificationStore";

const initalValues = {
  name: "test",
  user: {
    username: "test78238",
    password: "testpw123",
  },
  email: "t@t.de",
  phone: "123",
  producer: "http://localhost:8000/producers/12/",
  sensor: {
    device_id: "92983928",
    type: "CM",
  },
  rates: ["http://localhost:8000/rates/2/"],
};
const TextField = (props) => {
  return <MuiTextField className={"!min-w-[500px]"} {...props} />;
};

const formatApiData = (data) => {
  return data;
};

function AddConsumer(props) {
  const { values, handleChange, setValues, handleNestedChange } =
    useForm(initalValues);
  const navigate = useNavigate();
  const { consumerId } = useParams();
  const { apiRequest } = useApi();
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );

  const handleSave = () => {
    const method = consumerId ? "PUT" : "POST";
    const url = consumerId ? "consumers/" + consumerId + "/" : "consumers/";

    apiRequest({
      url: url,
      method: method,
      requestData: values,
      formatData: formatApiData,
    }).then((response) => {
      if (response.status === 201 || response.status === 200) {
        navigate("/kunden");
        setNotification({
          message: "Kunde wurde " + consumerId ? "gespeichert" : "angelegt",
          severity: "success",
        });
      }
    });
  };

  /**
   * If a consumerId is defined => a existing consumer is being edited.
   * Therefore on component render, the current values for that consumer is fetched.
   */
  useEffect(() => {
    if (consumerId) {
      apiRequest({ method: "get", url: "consumers/" + consumerId + "/" })
        .then((res) => {
          setValues(res.data);
        })
        .catch((e) => console.log(e));
    }
  }, [consumerId]);
  return (
    <div>
      <h2 className={"page-title"}>
        Kunde {consumerId ? "bearbeiten" : "hinzufügen"}
      </h2>
      <WidgetComponent>
        <form className={"flex flex-col gap-4 px-4"}>
          <TextField
            name={"name"}
            value={values.name}
            onChange={handleChange}
            placeholder={"Name"}
            label={"Name"}
          />
          <TextField
            name={"user.username"}
            value={values.user.username}
            onChange={handleNestedChange}
            placeholder={"Benutzername"}
            label={"Benutzername"}
          />
          <TextField
            name={"user.password"}
            value={values.user.password}
            onChange={handleNestedChange}
            placeholder={"Password"}
            label={"Password"}
            type={"password"}
          />
          <TextField
            name={"email"}
            value={values.email}
            onChange={handleChange}
            placeholder={"E-Mail"}
            label={"E-Mail"}
          />
          <TextField
            name={"phone"}
            value={values.phone}
            onChange={handleChange}
            placeholder={"Telefonnummer"}
            label={"Telefonnummer"}
          />
          <TextField
            name={"producer"}
            value={values.producer}
            onChange={handleChange}
            placeholder={"Produzent"}
            label={"Produzent"}
          />
          <TextField
            name={"sensor.device_id"}
            value={values.sensor.device_id}
            onChange={handleNestedChange}
            placeholder={"Sensorzählernummer"}
            label={"Sensorzählernummer"}
          />
          <TextField
            name={"rates"}
            value={values.rates}
            onChange={handleChange}
            placeholder={"Tarife"}
            label={"Tarife"}
          />
          <StyledButton
            variant={"contained"}
            color={"primary"}
            onClick={handleSave}
          >
            {consumerId ? "Speichern" : "Anlegen"}
          </StyledButton>
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={() => navigate("/kunden")}
          >
            Abbrechen
          </Button>
        </form>
      </WidgetComponent>
    </div>
  );
}

export default AddConsumer;
