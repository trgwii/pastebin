import { parse } from "https://git.rory.no/trgwii/Bundler/raw/branch/master/parse.ts";
import { decode } from "https://deno.land/std@0.69.0/encoding/ascii85.ts";
import { decompress } from "https://deno.land/x/brotli@v0.1.4/mod.ts";
export default parse(
  decompress(
    decode(
      "8VZrD-q:h&E.F]xTk0xdBw*:sbw%)3yu$}=rf>Jxq8yV+eL(?Y7QTEs]LPEQF*IzjIZI%TvkuGvI)m>^>%6]I1vb]e>lZ3*s<1D.*d.AAdH0.ng4lEJ8>O2bx:/y0cS6E%hHU<U6F)^078NN626yWUkMI@<xcq?b{=P3Kf/^hq8Ff1nMBucrZzMpdn1j}cd[AJ<8lA-W23{3vp>SB?S-PxlF!n=9km-Jj6qnMOCct24&p-sBcP$nr2/B^@0Cgwcu[XYUF<*rt1Eef=Odi)?t@fM>)^@.VKlP[^w0@KO{fGNFQ3q!}mzg:>xo:]e2O):gJ5oLF/rS7{uy7sv)ga700+cv2!4Hc!&2#SN7UnLO2dM<.VpAli[Z}xJN)l0}w2#&oF!PH%fZ-FgC=3Q4rIahQb!I6i1Mq(KBegej&nnreb5.FG27Uv4neP^j}D#<4&r-#(3%5G9XO-cW6.}>(2o<S>BhNZ=*W*w*2@a#GdmBvB[!0P&<qHOK6Dx>7{1[%?1@l}vaLp+bR<jgx4MEw+wB})?Qc1F4AioL*MJN=cgq#kJ2R=v6J&UDP*443:<{HYusDope9clnd/0Ir#vu@)JK#W:g!IQ]8?E}GgXwy>?cJ-8i{^lIX1o+Uut-*624zLJmQlVN1qRjI*D8cc^u@YS-d?o/W7n{E9a$oO:ygwWwDS?mY10KMyu%QGtC>6d1)Tasx*JtJ2d5ge*T2zm+FN$bFQ3O7{@$GXe@eI^vFoStF9FbKwHOc@KaqcTkljAsBOcWq44L03nQ(h<DJ^BeOBLQ.tg!heoSp[Vq+d5V^ic8p4SzzGeyPA?N1BAMw2*xdvZ-!bEgm@Ov}?^pzgV[lmoHe5yAo]}6-Wb!/>vh^}/b^WZ54EIf-}P4:I$5u=*LZL6B9gU6X:smBOF/V2NZZtyjL>HlkvJV4Y&?!YjG-cupovZ%2uTAeI(=Lq9J:}9VX<QHf@%MA1Fn7ZP3Ho]gTz^}8Bf{8ehq-DU>gsAV8/mfRFzF4FNF{(k4O0(WAU4Q!?o-2w@s:h:R(]^VYSP&C45SdKi/FJxJ1lCg8J[RhiKivnUG}vIbIG<NK7=hUv@N?A(W2xlE}q<1QVW.z+fe1jrDN1eg&BSu?b7^z{M>JuoQkNR17MIZMeSmQilv[ULyh5vWj/InjIk}W05dl>vMyE-8>P1tNp8VZK&Kvw(Ff42SA.FSk/d[@#yLMqPfvA&S:6.0A{:nFwu0Z:P)HgJVvN7b#S-v[2}=/lV19#2s:.3rIlgorUvTODDKsdW9TLAl#ppraj9j]sd0BsL^v[@vxB$a0+uGP",
      { standard: "Z85" },
    ),
  ),
);
