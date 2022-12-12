import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/IndividualRecordLinks.css";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import logo from "../images/RBIM_LOGO.png";
import { useSelector, useDispatch } from "react-redux";
import { submitToDatabase, defaultValue } from "../features/HouseholdInputs";

import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HouseholdRecordLinks = () => {
  const individual = useSelector((state) => state.householdRecord.individual);
  const householdValue = useSelector((state) => state.householdRecord.value);
  const isEmpty = useSelector((state) => state.householdRecord.isEmpty);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateButton = () => {
    return (
      <div>
        <button
          onClick={() => {
            if (
              individual.length !==
              Number(householdValue.totalNumberOfHouseholdMembers)
            ) {
              alert("Make sure the Total Number of Household is correct");
              return;
            }
            axios
              .post("http://localhost:80/rbimv5/server/Update_Household.php", {
                Household_Value: householdValue,
                individuals: individual,
              })
              .then(() => {
                dispatch(defaultValue());
                alert(
                  `${householdValue.nameOfRespondent} Successfully Updated!`
                );
                navigate("/reports");
              });
          }}
        >
          Update
        </button>
        <button
          onClick={() => {
            dispatch(defaultValue());
            navigate("/reports");
          }}
        >
          Cancel
        </button>
      </div>
    );
  };

  const submitButton = () => {
    if (individual.length > 1 && isEmpty === false)
      return (
        <button
          onClick={() => {
            dispatch(
              submitToDatabase({
                householdRecord: householdValue,
                individual: individual,
              })
            );
            alert(`${householdValue.nameOfRespondent} Added`);
            navigate("/household-record");
          }}
        >
          Submit
        </button>
      );
  };
  return (
    <>
      <section>
        <div className="IndividualLinks__box IndividualLinks__row">
          <div className="IndividualLinks__Title">
            <img src={logo} width="50" alt="" className="Reports__logo" />
            <h1>Household Records</h1>
          </div>
          <div className="IndividualLinks__row">
            {!householdValue.id && submitButton()}
            <NavLink
              style={({ isActive }) => {
                return isActive
                  ? { background: "#425F57", color: "white" }
                  : {};
              }}
              className="IndividualLinks__link IndividualLinks__btn"
              end
              to="/household-record"
            >
              <AccountCircleOutlinedIcon />
              <span className="IndividualLinks__link-text">
                Personal Information
              </span>
            </NavLink>
            <NavLink
              style={({ isActive }) => {
                return isActive
                  ? { background: "#425F57", color: "white" }
                  : {};
              }}
              className="IndividualLinks__link IndividualLinks__btn"
              to="/household-record/questions"
            >
              <Groups2OutlinedIcon />
              <span className="IndividualLinks__link-text">
                Household Records
              </span>
            </NavLink>
            {householdValue.id && updateButton()}
          </div>
        </div>
      </section>
    </>
  );
};

export default HouseholdRecordLinks;
