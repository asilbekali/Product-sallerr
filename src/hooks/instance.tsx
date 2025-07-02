import axios from "axios";
import { API } from "./getEnv.jsx";

export const instance = axios.create({baseURL:API})