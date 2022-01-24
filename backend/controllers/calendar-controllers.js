const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const User = require("../models/user-model");
const Calendar = require("../models/calendar-model");

const getCalendarsById = async (req, res, next) => {};
const createCalendar = async (req, res, next) => {
  // 달력 생성
};
const updateCalendarById = async (req, res, next) => {
  // 달력 정보 업데이트... 유저 제명 기능도 넣어야 하나?
};
const deleteCalendar = async (req, res, next) => {
  // 달력 삭제. 관련된 이벤트도 삭제함.
};
const addMemberToCalendar = async (req, res, next) => {
  // 달력에 멤버 추가. 닉네임, 역할을 입력 받음
};
