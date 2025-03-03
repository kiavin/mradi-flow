<script setup>
import FaetureButton from '../atoms/buttons/FaetureButton.vue'
import FeaturesGrid from './FeaturesGrid.vue';
</script>
<template>
  <section>
    <div class="c7rlc c4lt2 ca7yh cxk7g c62s6">
      <div class="cdzmb cpl4a cxmgp" aria-hidden="true">
        <div class="ca1ms cq6fz csbhs c7anr cblyu">
          <img
            src="../../assets/images/glow-top.svg"
            class="cw312"
            width="1404"
            height="658"
            alt="Features Illustration"
          />
        </div>
      </div>

      <div class="cjqw8 cyuy9 cpwbp c5dbr">
        <div x-data="{ tab: '1' }">
          <div class="cjklf cng6q cnei8 cj4ls cwj02 c0z63 cre2l c5ett cz0pw cg9hr cxk7g citnk">
            <div class="cezm6 cddom cpjot cxjps c65se" data-aos="fade-down">
              <!-- Content #1 -->
              <div>
                <div class="c80q8 crgfn cpvrw cic8n cnt4i c1ser cm2qf clj4z">Omniface Features</div>
              </div>
              <h3 class="chl73 c80q8 ch30f crgfn c9p57 cnt4i clj4z c78uk">
                From idea to implementation in a flash
              </h3>
              <p class="c16mo csqzg ci5zu">
                "Ignite your frontend. Zero boilerplate, maximum velocity. Omniface accelerates your
                Vue 3 projects, turning ideas into code at warp speed."
              </p>
              <div class="ckwe7 cmcd2 c0fvl cbg2n">
                <FaetureButton title="🛠 Ignite your frontend">
                  <template #icon>
                    <svg
                      class="c21kk clbq5 cuupb"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12Zm0 14V2H2v12h12Zm-3-7H5a1 1 0 1 1 0-2h6a1 1 0 0 1 0 2Zm0 4H5a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2Z"
                      ></path>
                    </svg>
                  </template>
                </FaetureButton>
                <FaetureButton title="⚡ Instant UI generation">
                  <template #icon>
                    <svg
                      class="c21kk clbq5 cuupb"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M2 6H0V2a2 2 0 0 1 2-2h4v2H2v4ZM16 6h-2V2h-4V0h4a2 2 0 0 1 2 2v4ZM14 16h-4v-2h4v-4h2v4a2 2 0 0 1-2 2ZM6 16H2a2 2 0 0 1-2-2v-4h2v4h4v2Z"
                      ></path>
                    </svg>
                  </template>
                </FaetureButton>

                <FaetureButton title="💡 Atomic Design + Best Practices">
                  <template #icon>
                    <svg
                      class="c21kk clbq5 cuupb"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M14.3.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-8 8c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l8-8ZM15 7c.6 0 1 .4 1 1 0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8c.6 0 1 .4 1 1s-.4 1-1 1C4.7 2 2 4.7 2 8s2.7 6 6 6 6-2.7 6-6c0-.6.4-1 1-1Z"
                      ></path>
                    </svg>
                  </template>
                </FaetureButton>
              </div>
            </div>

           <FeaturesGrid />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>