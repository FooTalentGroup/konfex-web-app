const { minify } = require("terser");
const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

async function minifyFiles() {
  try {
    const distPath = path.join(__dirname, "..", "dist");

    const files = await glob("**/*.js", {
      cwd: distPath,
      ignore: ["**/*.map.js", "**/*.min.js"],
      absolute: true,
    });

    for (const file of files) {
      const code = fs.readFileSync(file, "utf8");

      const result = await minify(code, {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ["console.debug", "console.trace"],
          passes: 2,
          dead_code: true,
          unused: true,
        },
        mangle: {
          toplevel: false,
          keep_classnames: false,
          keep_fnames: false,
          reserved: [
            "exports",
            "module",
            "require",
            "__dirname",
            "__filename",
            "global",
          ], // Reservar nombres importantes de Node.js
        },
        format: {
          comments: false,
          beautify: false,
          preserve_annotations: false,
        },
        sourceMap: false,
      });

      if (result.error) {
        console.error(`Error minificando ${file}:`, result.error);
        continue;
      }

      fs.writeFileSync(file, result.code);
    }

    console.log("✅ Minificación completada con éxito");
  } catch (e) {
    console.error("Error al minificar archivos:", e);
    process.exit(1);
  }
}

minifyFiles();
