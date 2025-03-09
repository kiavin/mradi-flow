<script setup>
import { ref } from 'vue'

const version = ref('1.0.0')
const date = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="c7rlc ca7yh cxk7g c62s6">
      <!-- Blocks -->
      <div class="cd7js c7052 c9xwv co6zy cm9vp">
        <!-- 1st block -->
        <div class="cl3r2 cben8 ccaj3 c65se">
          <div class="cu781 cg5wk ceta9 cg9hr crsge citnk">
            <div class="cdu7y cmhzb">
              <div class="cmhzb">
                <!-- Logo -->
                <a class="c1ser" href="index.html" aria-label="Cruip">
                  <img src="../../assets/images/logo.svg" width="38" height="38" alt="Stellar" />
                </a>
              </div>
              <div class="chu7q c4cae">
                © {{ date }} CrcakItTechnologies <span class="c5668">-</span> All rights reserved.
              </div>
            </div>
             
          </div>
        </div>

        <!-- 2nd block -->
        <div class="ctfcd cdk1r c3sly">
          <h6 class="cqbkb cm2qf c4cae c4ecq">Omniface Version {{ version }}</h6>
          <ul class="cmcd2 c4cae">
            <li>
              <a class="cj1pe c16mo cz8jp cscsd coh5f" href="#0">Node Version : </a>
            </li>
            <li>
              <a class="cj1pe c16mo cz8jp cscsd coh5f" href="#0">Warp CLI : </a>
            </li>
            <li>
              <a class="cj1pe c16mo cz8jp cscsd coh5f" href="#0"></a>
            </li>
            <li>
              <a class="cj1pe c16mo cz8jp cscsd coh5f" href="#0">Server: </a>
            </li>
            
          </ul>
        </div>

        <!-- 3rd block -->
      </div>
    </div>
  </footer>
</template>