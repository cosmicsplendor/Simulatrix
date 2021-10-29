const fragShaderSrc = 
`   #version 300 es
    precision highp float;
    
    in vec2 tex_coords;
    
    uniform sampler2D tex_unit;
    uniform bool overlay;
    uniform vec3 overlay_col;
    uniform vec4 g_tint;
    uniform vec4 tint;
    uniform float alpha;

    out vec4 out_color;
    void main() {
        vec4 px_col = texture(tex_unit, tex_coords);
        if (overlay) {
            out_color = vec4(overlay_col, px_col.a * alpha);
            return;
        } 
        out_color = vec4((px_col + g_tint + tint).rgb, px_col.a * alpha);
    }
`

export default fragShaderSrc