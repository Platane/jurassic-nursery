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


  mat4 bm = 
    bm0 * a_weights[0] +
    bm1 * a_weights[1] +
    bm2 * a_weights[2] +
    bm3 * a_weights[3] ;

  gl_Position = u_matrix * bm * a_position;

  v_normal = mat3(bm) * vec3(  u_normalMatrix  * a_normal);
  v_color = a_color;
 
}

