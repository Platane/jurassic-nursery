#version 300 es
precision highp float;

// attributes
in vec4 a_position;
in vec4 a_normal;
in vec3 a_color;
in vec4 a_weights;
in uvec4 a_boneIndexes;


// uniforms
uniform mat4 u_matrix;
uniform mat4 u_normalMatrix;
uniform sampler2D u_boneMatrixTexture;

out vec3 v_normal;
out vec3 v_color;

 



void main() {


  mat4 bm0 = mat4(
    texelFetch(u_boneMatrixTexture, ivec2(0, a_boneIndexes[0]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(1, a_boneIndexes[0]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(2, a_boneIndexes[0]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(3, a_boneIndexes[0]), 0)
  );

  mat4 bm1 = mat4(
    texelFetch(u_boneMatrixTexture, ivec2(0, a_boneIndexes[1]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(1, a_boneIndexes[1]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(2, a_boneIndexes[1]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(3, a_boneIndexes[1]), 0)
  );

  mat4 bm2 = mat4(
    texelFetch(u_boneMatrixTexture, ivec2(0, a_boneIndexes[2]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(1, a_boneIndexes[2]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(2, a_boneIndexes[2]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(3, a_boneIndexes[2]), 0)
  );

  mat4 bm3 = mat4(
    texelFetch(u_boneMatrixTexture, ivec2(0, a_boneIndexes[3]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(1, a_boneIndexes[3]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(2, a_boneIndexes[3]), 0),
    texelFetch(u_boneMatrixTexture, ivec2(3, a_boneIndexes[3]), 0)
  );


  gl_Position = u_matrix * (
    bm0 * a_position * a_weights[0] +
    bm1 * a_position * a_weights[1] +
    bm2 * a_position * a_weights[2] +
    bm3 * a_position * a_weights[3] 
  );

  v_normal = vec3(  u_normalMatrix  * a_normal);
  v_color = a_color;
 
  // v_color = a_weights.xyz;
}

