varying vec2 vUv;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;
uniform sampler2D uTexture4;
uniform sampler2D uDisp;
uniform vec2 uResolution;
uniform float uAnimation;

mat2 scale(vec2 _scale){
    return mat2(_scale.x, 0., 0., _scale.y);
}

void main(){
    vec2 newUV = (vUv - vec2(0.5)) * uResolution.xy + vec2(0.5);

    vec2 st = newUV;
    st -= vec2(0.5);
    st = scale(vec2(0.8 + (uAnimation * 0.2))) * st;
    st += vec2(0.5);
    
    vec2 ed = newUV;
    ed -= vec2(0.5);
    ed = scale(vec2(1.04 - (uAnimation * 0.02))) * ed;
    ed += vec2(0.5);

    vec4 img1 = texture2D(uTexture1, st);
    vec4 img2 = texture2D(uTexture2, ed);
    vec4 displace = texture2D(uDisp, newUV);
    float disp = smoothstep(0. ,displace.r, uAnimation);
    vec4 color = mix(img1, img2, disp);
    gl_FragColor = color;


    // vec4[] array[] = vec4[](
    // texture2D(uTexture1, newUV),
    // texture2D(uTexture2, newUV),
    // texture2D(uTexture3, newUV),
    // texture2D(uTexture4, newUV)
    // );

    // vec4 displace = texture2D(uDisp, newUV);
    // float disp = smoothstep(0. ,displace.r, uAnimation);

    // for (int i=0;i<4;i++){
    //     vec4 color = mix(array[i], array[i+1], disp);
    //     gl_FragColor = color;
    // };
}
