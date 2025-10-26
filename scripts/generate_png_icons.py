#!/usr/bin/env python3
"""
PNG Icon Generator for AI Hiring System
Converts SVG favicon to multiple PNG sizes
Requires: pip install cairosvg pillow

Run from repo root:
  python scripts/generate_png_icons.py
"""

import io
import os

try:
    import cairosvg
    from PIL import Image
except ImportError as e:
    print("Missing dependency. Install with: pip install cairosvg pillow")
    raise

PUBLIC_DIR = os.path.join(os.path.dirname(
    __file__), '..', 'frontend', 'public')
ICONS_DIR = os.path.join(PUBLIC_DIR, 'icons')


def svg_to_png(svg_content: str, size: int) -> bytes:
    """Convert SVG to PNG at specified size"""
    return cairosvg.svg2png(
        bytestring=svg_content.encode('utf-8'),
        output_width=size,
        output_height=size,
        background_color=None,
    )


def create_favicon_pack():
    # Read the SVG content
    svg_path = os.path.join(PUBLIC_DIR, 'favicon.svg')
    if not os.path.exists(svg_path):
        raise FileNotFoundError(
            f"Missing {svg_path}. Ensure favicon.svg exists in public/")

    with open(svg_path, 'r', encoding='utf-8') as f:
        svg_content = f.read()

    # Create icons directory
    os.makedirs(ICONS_DIR, exist_ok=True)

    # Define required sizes
    sizes = [16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 384, 512]

    for size in sizes:
        png_data = svg_to_png(svg_content, size)
        out_path = os.path.join(ICONS_DIR, f'icon-{size}.png')
        with open(out_path, 'wb') as f:
            f.write(png_data)
        print(f"✅ Generated {out_path}")

    # favicon.ico (multi-size)
    img_16 = Image.open(io.BytesIO(svg_to_png(svg_content, 16)))
    img_32 = Image.open(io.BytesIO(svg_to_png(svg_content, 32)))
    img_48 = Image.open(io.BytesIO(svg_to_png(svg_content, 48)))

    ico_path = os.path.join(PUBLIC_DIR, 'favicon.ico')
    img_16.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"✅ Generated {ico_path}")

    # Apple touch icon (180x180)
    apple_touch = os.path.join(PUBLIC_DIR, 'apple-touch-icon.png')
    with open(apple_touch, 'wb') as f:
        f.write(svg_to_png(svg_content, 180))
    print(f"✅ Generated {apple_touch}")

    # Maskable icon (512x512 with padding)
    maskable_svg = svg_content.replace(
        'viewBox="0 0 64 64"', 'viewBox="-8 -8 80 80"')
    mask_out = os.path.join(ICONS_DIR, 'icon-512-maskable.png')
    with open(mask_out, 'wb') as f:
        f.write(svg_to_png(maskable_svg, 512))
    print(f"✅ Generated {mask_out}")


if __name__ == '__main__':
    create_favicon_pack()
    print("\n🎉 Favicon pack generation complete!")
