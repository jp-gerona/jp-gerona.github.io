"""Convert UnoCSS's EB Garamond web fonts for the Typst PDF.

Run `pnpm astro check` first to generate the WOFF2 files. Requires fontTools
and Node.js; Node's built-in Brotli decoder avoids a second Python package.
"""

from pathlib import Path
import subprocess
import sys
import types


def decompress_brotli(data):
    return subprocess.run(
        [
            "node",
            "-e",
            "process.stdout.write(require('node:zlib').brotliDecompressSync(require('node:fs').readFileSync(0)))",
        ],
        input=data,
        capture_output=True,
        check=True,
    ).stdout


node_brotli = types.ModuleType("brotli")
node_brotli.decompress = decompress_brotli
sys.modules["brotli"] = node_brotli

from fontTools.ttLib import TTFont  # noqa: E402

root = Path(__file__).resolve().parent.parent
web_fonts = root / "public/assets/fonts"
pdf_fonts = root / "templates/fonts"
resume_text = (root / "src/content/resume/resume.yaml").read_text()
required_characters = {ord(char) for char in resume_text + "• |" if char.isprintable()}

for style in ("Regular", "Italic"):
    matching_font = None
    for path in sorted(web_fonts.glob("ebgaramond-*.woff2")):
        font = TTFont(path)
        if font["name"].getDebugName(2) != style:
            continue
        if not required_characters.issubset(font.getBestCmap()):
            continue
        if style == "Regular" and not any(
            axis.axisTag == "wght" and axis.minValue <= 700 <= axis.maxValue
            for axis in font["fvar"].axes
        ):
            continue
        matching_font = font
        break

    if matching_font is None:
        raise SystemExit(f"Missing UnoCSS EB Garamond {style} font covering the resume")

    matching_font.flavor = None
    matching_font.save(pdf_fonts / f"EBGaramond-{style}.ttf")
