const Layouts = require("../models/layouts");
const Foto = require("../models/Foto");

const nuevoLayout = async (req, res) => {
  try {
    const {
      quepared,
      name,
      ledCount,
      baseWidth,
      baseHeight,
      defaultHoldSize,
      holds,
      foto_id,
    } = req.body;

    // Validaciones básicas
    if (
      !quepared ||
      !name ||
      !ledCount ||
      !baseWidth ||
      !baseHeight ||
      !foto_id
    ) {
      return res.status(400).json({
        status: "error",
        mensaje:
          "Faltan campos obligatorios. Necesitas 'quepared', 'name', 'ledCount', 'baseWidth', 'baseHeight' y 'foto_id'.",
      });
    }

    // 1) Comprobar que la foto existe
    const foto = await Foto.findById(foto_id);

    if (!foto) {
      return res.status(404).json({
        status: "error",
        mensaje: "La foto indicada no existe",
      });
    }

    // (Opcional pero recomendable) comprobar que coincide la pared
    // if (foto.quepared !== quepared) {
    //   return res.status(400).json({
    //     status: "error",
    //     mensaje: "La foto no pertenece a la misma pared ('quepared')",
    //   });
    // }

    const layoutData = {
      quepared,
      name,
      ledCount,
      baseWidth,
      baseHeight,
      defaultHoldSize: defaultHoldSize ?? 36,
      holds: holds || [],
      foto_id: foto._id,
      foto_url_publica: foto.url_publica,
    };

    const nuevoLayout = await Layouts.create(layoutData);

    return res.status(201).json({
      status: "ok",
      mensaje: "Layout creado correctamente",
      layout: nuevoLayout,
    });
  } catch (err) {
    console.error("Error creando layout:", err);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno creando el layout",
    });
  }
};

module.exports = { nuevoLayout };
