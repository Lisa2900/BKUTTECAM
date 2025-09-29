import { Router } from "express";

import { crearContenido,getNosotrosContenido,updateNosotrosContenido,deleteNosotrosContenido } from "../controllers/nosotrosController";

const router = Router();


router.post("/contenido", crearContenido);
router.get("/contenido", getNosotrosContenido);
router.put("/contenido/:id", updateNosotrosContenido);
router.delete("/contenido/:id", deleteNosotrosContenido);

export default router;
