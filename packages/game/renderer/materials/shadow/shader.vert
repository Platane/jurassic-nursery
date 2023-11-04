#version 300 es
precision highp float;

uniform mat4 u_matrix;

// attributes
in vec4 a_position;
in vec2 a_texcoord;

out vec2 v_texcoord;


void main() {


  gl_Position = u_matrix * a_position;
  v_texcoord = a_texcoord;

}

