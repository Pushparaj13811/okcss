-- Curated "Inspiration" presets for the /explore page.
-- Run this once in the Supabase SQL editor after running 001_presets.sql.
-- All presets are owned by a sentinel user "curated@okcss.dev" and are public.

INSERT INTO presets (user_email, tool, name, state, is_public) VALUES

-- ── Shadow ──────────────────────────────────────────────────────────────────
('curated@okcss.dev', 'shadow', 'Stripe card', '{"layers":[{"id":"c-s1","x":0,"y":4,"blur":24,"spread":-4,"color":"#6366f1","opacity":0.35,"inset":false,"enabled":true}]}', true),
('curated@okcss.dev', 'shadow', 'Apple elevate', '{"layers":[{"id":"c-s2","x":0,"y":2,"blur":8,"spread":0,"color":"#000000","opacity":0.08,"inset":false,"enabled":true},{"id":"c-s3","x":0,"y":12,"blur":40,"spread":-8,"color":"#000000","opacity":0.15,"inset":false,"enabled":true}]}', true),
('curated@okcss.dev', 'shadow', 'Neon glow', '{"layers":[{"id":"c-s4","x":0,"y":0,"blur":32,"spread":4,"color":"#6366f1","opacity":0.7,"inset":false,"enabled":true}]}', true),
('curated@okcss.dev', 'shadow', 'Inner pressed', '{"layers":[{"id":"c-s5","x":0,"y":2,"blur":8,"spread":0,"color":"#000000","opacity":0.2,"inset":true,"enabled":true}]}', true),

-- ── Glassmorphism ────────────────────────────────────────────────────────────
('curated@okcss.dev', 'glassmorphism', 'Frosted card', '{"bgColor":"#ffffff","bgOpacity":0.15,"blur":12,"borderColor":"#ffffff","borderOpacity":0.3,"borderRadius":16}', true),
('curated@okcss.dev', 'glassmorphism', 'Dark glass', '{"bgColor":"#0a0a0a","bgOpacity":0.4,"blur":20,"borderColor":"#ffffff","borderOpacity":0.08,"borderRadius":20}', true),
('curated@okcss.dev', 'glassmorphism', 'Tinted indigo', '{"bgColor":"#6366f1","bgOpacity":0.12,"blur":16,"borderColor":"#6366f1","borderOpacity":0.25,"borderRadius":12}', true),

-- ── Gradient ─────────────────────────────────────────────────────────────────
('curated@okcss.dev', 'gradient', 'Indigo to pink', '{"type":"linear","angle":135,"stops":[{"id":"c-g1","color":"#6366f1","position":0},{"id":"c-g2","color":"#ec4899","position":100}]}', true),
('curated@okcss.dev', 'gradient', 'Sunset', '{"type":"linear","angle":120,"stops":[{"id":"c-g3","color":"#f97316","position":0},{"id":"c-g4","color":"#ec4899","position":50},{"id":"c-g5","color":"#8b5cf6","position":100}]}', true),
('curated@okcss.dev', 'gradient', 'Ocean radial', '{"type":"radial","angle":135,"stops":[{"id":"c-g6","color":"#06b6d4","position":0},{"id":"c-g7","color":"#6366f1","position":100}]}', true),
('curated@okcss.dev', 'gradient', 'Mint fresh', '{"type":"linear","angle":160,"stops":[{"id":"c-g8","color":"#10b981","position":0},{"id":"c-g9","color":"#06b6d4","position":100}]}', true),

-- ── Border Radius ────────────────────────────────────────────────────────────
('curated@okcss.dev', 'border-radius', 'Pill', '{"mode":"uniform","uniform":9999,"topLeft":9999,"topRight":9999,"bottomRight":9999,"bottomLeft":9999}', true),
('curated@okcss.dev', 'border-radius', 'Squircle', '{"mode":"uniform","uniform":28,"topLeft":28,"topRight":28,"bottomRight":28,"bottomLeft":28}', true),
('curated@okcss.dev', 'border-radius', 'Asymmetric', '{"mode":"individual","uniform":16,"topLeft":40,"topRight":8,"bottomRight":40,"bottomLeft":8}', true),

-- ── Filter ───────────────────────────────────────────────────────────────────
('curated@okcss.dev', 'filter', 'Vintage film', '{"blur":0,"brightness":95,"contrast":110,"grayscale":20,"hueRotate":15,"invert":0,"saturate":75,"sepia":30}', true),
('curated@okcss.dev', 'filter', 'Dreamy blur', '{"blur":4,"brightness":110,"contrast":90,"grayscale":0,"hueRotate":0,"invert":0,"saturate":120,"sepia":0}', true),
('curated@okcss.dev', 'filter', 'Grayscale', '{"blur":0,"brightness":100,"contrast":105,"grayscale":100,"hueRotate":0,"invert":0,"saturate":100,"sepia":0}', true),

-- ── Transform ────────────────────────────────────────────────────────────────
('curated@okcss.dev', 'transform', 'Hover lift', '{"rotate":0,"scaleX":1.05,"scaleY":1.05,"translateX":0,"translateY":-4,"skewX":0,"skewY":0}', true),
('curated@okcss.dev', 'transform', 'Tilted card', '{"rotate":-3,"scaleX":1,"scaleY":1,"translateX":0,"translateY":0,"skewX":0,"skewY":0}', true),

-- ── Clip-Path ────────────────────────────────────────────────────────────────
('curated@okcss.dev', 'clip-path', 'Classic triangle', '{"type":"polygon","preset":"triangle","circleRadius":50,"circleCx":50,"circleCy":50,"ellipseRx":50,"ellipseRy":35,"ellipseCx":50,"ellipseCy":50,"insetTop":0,"insetRight":0,"insetBottom":0,"insetLeft":0,"insetRadius":0}', true),
('curated@okcss.dev', 'clip-path', 'Star burst', '{"type":"polygon","preset":"star","circleRadius":50,"circleCx":50,"circleCy":50,"ellipseRx":50,"ellipseRy":35,"ellipseCx":50,"ellipseCy":50,"insetTop":0,"insetRight":0,"insetBottom":0,"insetLeft":0,"insetRadius":0}', true),
('curated@okcss.dev', 'clip-path', 'Circle crop', '{"type":"circle","preset":"triangle","circleRadius":48,"circleCx":50,"circleCy":50,"ellipseRx":50,"ellipseRy":35,"ellipseCx":50,"ellipseCy":50,"insetTop":0,"insetRight":0,"insetBottom":0,"insetLeft":0,"insetRadius":0}', true),

-- ── Outline ──────────────────────────────────────────────────────────────────
('curated@okcss.dev', 'outline', 'Focus ring', '{"width":2,"style":"solid","color":"#6366f1","offset":2,"opacity":1}', true),
('curated@okcss.dev', 'outline', 'Dashed border', '{"width":2,"style":"dashed","color":"#6366f1","offset":4,"opacity":1}', true),

-- ── Transition ───────────────────────────────────────────────────────────────
('curated@okcss.dev', 'transition', 'Smooth all', '{"layers":[{"id":"c-t1","property":"all","duration":300,"easing":"ease","delay":0}]}', true),
('curated@okcss.dev', 'transition', 'Spring-like', '{"layers":[{"id":"c-t2","property":"transform","duration":400,"easing":"cubic-bezier(0.34, 1.56, 0.64, 1)","delay":0}]}', true),

-- ── Cubic Bezier ─────────────────────────────────────────────────────────────
('curated@okcss.dev', 'cubic-bezier', 'Ease in out', '{"x1":0.42,"y1":0,"x2":0.58,"y2":1}', true),
('curated@okcss.dev', 'cubic-bezier', 'Bounce out', '{"x1":0.34,"y1":1.56,"x2":0.64,"y2":1}', true),
('curated@okcss.dev', 'cubic-bezier', 'Sharp decel', '{"x1":0,"y1":0.7,"x2":0.4,"y2":1}', true),

-- ── Text Shadow ──────────────────────────────────────────────────────────────
('curated@okcss.dev', 'text-shadow', 'Soft lift', '{"x":2,"y":4,"blur":12,"color":"#6366f1","opacity":0.5,"previewText":"Hello","fontSize":64}', true),
('curated@okcss.dev', 'text-shadow', 'Retro pop', '{"x":4,"y":4,"blur":0,"color":"#ec4899","opacity":1,"previewText":"Hello","fontSize":64}', true),

-- ── Neumorphism ──────────────────────────────────────────────────────────────
('curated@okcss.dev', 'neumorphism', 'Classic soft', '{"color":"#e0e5ec","intensity":0.15,"blur":20,"distance":8,"borderRadius":16,"shape":"flat"}', true),
('curated@okcss.dev', 'neumorphism', 'Pressed inset', '{"color":"#e0e5ec","intensity":0.15,"blur":16,"distance":6,"borderRadius":16,"shape":"pressed"}', true),

-- ── Color Palette ────────────────────────────────────────────────────────────
('curated@okcss.dev', 'color-palette', 'Indigo system', '{"baseColor":"#6366f1","harmony":"monochromatic","shades":5}', true),
('curated@okcss.dev', 'color-palette', 'Complementary ocean', '{"baseColor":"#06b6d4","harmony":"complementary","shades":0}', true),
('curated@okcss.dev', 'color-palette', 'Triadic vibrant', '{"baseColor":"#ec4899","harmony":"triadic","shades":0}', true)

ON CONFLICT DO NOTHING;
