#version 300 es

// attributes
in vec4 a_position;
in vec4 a_normal;


// uniforms
uniform mat4 u_matrix;
uniform mat4 u_normalMatrix;

out vec3 v_normal;


void main() {
  gl_Position = u_matrix  * a_position;
  v_normal = vec3(  u_normalMatrix  * a_normal);
}

