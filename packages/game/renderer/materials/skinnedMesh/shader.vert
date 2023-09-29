#version 300 es
precision highp float;

// attributes
in vec4 a_position;
in vec4 a_normal;
in mat4 a_colorSchema;
in uint a_colorPattern;
in vec4 a_weights;
in uvec4 a_boneIndexes;
in uint a_entityIndex;


// uniforms
uniform mat4 u_viewMatrix;
uniform sampler2D u_boneMatrixTexture;
uniform sampler2D u_colorSchemaTexture;

out vec3 v_normal;
out vec3 v_color;

 

void main() {

  int n = int(a_entityIndex);

  mat4 bm0 = mat4(
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[0]) + 0, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[0]) + 1, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[0]) + 2, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[0]) + 3, n), 0)
  );

  mat4 bm1 = mat4(
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[1]) + 0, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[1]) + 1, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[1]) + 2, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[1]) + 3, n), 0)
  );

  mat4 bm2 = mat4(
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[2]) + 0, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[2]) + 1, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[2]) + 2, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[2]) + 3, n), 0)
  );

  mat4 bm3 = mat4(
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[3]) + 0, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[3]) + 1, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[3]) + 2, n), 0),
    texelFetch(u_boneMatrixTexture, ivec2(4 * int(a_boneIndexes[3]) + 3, n), 0)
  );


  mat4 bm = 
    bm0 * a_weights[0] +
    bm1 * a_weights[1] +
    bm2 * a_weights[2] +
    bm3 * a_weights[3] ;

  gl_Position = u_viewMatrix * bm * a_position;
  // gl_Position = u_viewMatrix  * a_position;

  v_normal = mat3( bm) * vec3(a_normal);
  // v_normal =  vec3(a_normal);


  vec4 color = texelFetch(u_colorSchemaTexture, ivec2(a_colorPattern, n), 0);

  v_color = color.xyz;
}

