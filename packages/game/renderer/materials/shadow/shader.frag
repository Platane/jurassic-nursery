#version 300 es
precision highp float;


in vec2 v_texcoord;





out vec4 outColor;

void main() {

  vec2 a = vec2( 0.5 - v_texcoord.x, 0.5 - v_texcoord.y );

  float l = length(a) / 0.7071067811865476 * 1.3;

  float o = (1.0-l*l*l) ;

  outColor = vec4(0,0,0,o * 0.5  );

}
