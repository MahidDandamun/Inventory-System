// app/(auth)/_components/inventory-illustration.tsx
// Animated SVG illustration for the login page hero panel

export function InventoryIllustration() {
    return (
        <svg
            viewBox="0 0 520 480"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full max-h-[480px]"
            aria-hidden="true"
        >
            <defs>
                {/* Gradients */}
                <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#fb923c" stopOpacity="0.04" />
                </linearGradient>
                <linearGradient id="shelfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="100%" stopColor="#c2410c" />
                </linearGradient>
                <linearGradient id="box1Grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <linearGradient id="box2Grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fdba74" />
                    <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
                <linearGradient id="box3Grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fed7aa" />
                    <stop offset="100%" stopColor="#fdba74" />
                </linearGradient>
                <linearGradient id="chartGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#fb923c" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="chartGrad2" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#fde68a" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f97316" floodOpacity="0.2" />
                </filter>
            </defs>

            {/* Background circle */}
            <circle cx="260" cy="240" r="220" fill="url(#bgGrad)" />

            {/* ═══════════════════════════════════════
                WAREHOUSE SHELVING UNIT
            ═══════════════════════════════════════ */}
            {/* Main frame — vertical posts */}
            <rect x="80" y="130" width="8" height="280" rx="3" fill="url(#shelfGrad)" opacity="0.9" />
            <rect x="288" y="130" width="8" height="280" rx="3" fill="url(#shelfGrad)" opacity="0.9" />

            {/* Shelf planks */}
            <rect x="80" y="130" width="216" height="10" rx="3" fill="url(#shelfGrad)" />
            <rect x="80" y="218" width="216" height="10" rx="3" fill="url(#shelfGrad)" />
            <rect x="80" y="306" width="216" height="10" rx="3" fill="url(#shelfGrad)" />
            <rect x="80" y="400" width="216" height="10" rx="3" fill="url(#shelfGrad)" />

            {/* ═══════════════════════════════════════
                ROW 1 BOXES (top shelf)  — floating animation
            ═══════════════════════════════════════ */}
            {/* Box A — big orange */}
            <g filter="url(#softShadow)">
                <rect x="95" y="152" width="62" height="62" rx="6" fill="url(#box1Grad)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="3.2s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
                {/* box lid */}
                <rect x="95" y="152" width="62" height="12" rx="4" fill="#c2410c" opacity="0.6">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="3.2s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
                {/* tape stripe */}
                <line x1="126" y1="152" x2="126" y2="214" stroke="#fff" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.5">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="3.2s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </line>
            </g>

            {/* Box B — medium light */}
            <g filter="url(#softShadow)">
                <rect x="170" y="160" width="48" height="55" rx="6" fill="url(#box2Grad)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-7; 0,0"
                        dur="4s"
                        begin="0.5s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
                <rect x="170" y="160" width="48" height="10" rx="4" fill="#ea580c" opacity="0.5">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-7; 0,0"
                        dur="4s"
                        begin="0.5s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
            </g>

            {/* Box C — small cream */}
            <g filter="url(#softShadow)">
                <rect x="232" y="170" width="44" height="44" rx="6" fill="url(#box3Grad)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-4; 0,0"
                        dur="3.6s"
                        begin="1s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
                <rect x="232" y="170" width="44" height="9" rx="4" fill="#fb923c" opacity="0.4">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-4; 0,0"
                        dur="3.6s"
                        begin="1s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
            </g>

            {/* ═══════════════════════════════════════
                ROW 2 BOXES (middle shelf)
            ═══════════════════════════════════════ */}
            <g filter="url(#softShadow)">
                <rect x="95" y="240" width="50" height="60" rx="6" fill="url(#box2Grad)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-6; 0,0"
                        dur="3.8s"
                        begin="0.3s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
                <rect x="95" y="240" width="50" height="10" rx="4" fill="#ea580c" opacity="0.5">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-6; 0,0"
                        dur="3.8s"
                        begin="0.3s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
            </g>
            <g filter="url(#softShadow)">
                <rect x="158" y="232" width="68" height="68" rx="6" fill="url(#box1Grad)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="4.2s"
                        begin="1.2s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
                <rect x="158" y="232" width="68" height="12" rx="4" fill="#c2410c" opacity="0.6">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="4.2s"
                        begin="1.2s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
                <line x1="192" y1="232" x2="192" y2="300" stroke="#fff" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.5">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="4.2s"
                        begin="1.2s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </line>
            </g>
            <g filter="url(#softShadow)">
                <rect x="240" y="248" width="42" height="50" rx="6" fill="url(#box3Grad)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-6; 0,0"
                        dur="3.5s"
                        begin="0.8s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
            </g>

            {/* ═══════════════════════════════════════
                ROW 3 BOXES (bottom shelf)
            ═══════════════════════════════════════ */}
            <g filter="url(#softShadow)">
                <rect x="88" y="328" width="78" height="66" rx="6" fill="url(#box1Grad)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-4; 0,0"
                        dur="5s"
                        begin="0.6s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
                <rect x="88" y="328" width="78" height="12" rx="4" fill="#c2410c" opacity="0.6">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-4; 0,0"
                        dur="5s"
                        begin="0.6s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
            </g>
            <g filter="url(#softShadow)">
                <rect x="178" y="338" width="52" height="56" rx="6" fill="url(#box2Grad)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="4.4s"
                        begin="1.5s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
            </g>
            <g filter="url(#softShadow)">
                <rect x="244" y="344" width="44" height="50" rx="6" fill="url(#box3Grad)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-6; 0,0"
                        dur="3.7s"
                        begin="2s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
            </g>

            {/* ═══════════════════════════════════════
                MINI BAR CHART — floating card (right side)
            ═══════════════════════════════════════ */}
            <g>
                {/* card bg */}
                <rect x="330" y="148" width="152" height="110" rx="12" fill="white" opacity="0.92" filter="url(#softShadow)" />
                <text x="346" y="172" fontSize="11" fontWeight="700" fill="#1e293b" fontFamily="system-ui">Stock Overview</text>
                {/* bars */}
                <rect x="346" y="218" width="18" height="26" rx="3" fill="url(#chartGrad)">
                    <animate attributeName="height" values="10;26;10" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
                    <animate attributeName="y" values="234;218;234" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
                </rect>
                <rect x="372" y="200" width="18" height="44" rx="3" fill="url(#chartGrad)">
                    <animate attributeName="height" values="20;44;20" dur="3s" begin="0.3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
                    <animate attributeName="y" values="224;200;224" dur="3s" begin="0.3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
                </rect>
                <rect x="398" y="208" width="18" height="36" rx="3" fill="url(#chartGrad2)">
                    <animate attributeName="height" values="14;36;14" dur="2.8s" begin="0.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
                    <animate attributeName="y" values="230;208;230" dur="2.8s" begin="0.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
                </rect>
                <rect x="424" y="195" width="18" height="49" rx="3" fill="url(#chartGrad)">
                    <animate attributeName="height" values="22;49;22" dur="3.3s" begin="0.9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
                    <animate attributeName="y" values="222;195;222" dur="3.3s" begin="0.9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
                </rect>
                <rect x="450" y="210" width="18" height="34" rx="3" fill="url(#chartGrad2)">
                    <animate attributeName="height" values="12;34;12" dur="2.6s" begin="1.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
                    <animate attributeName="y" values="232;210;232" dur="2.6s" begin="1.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
                </rect>
                {/* baseline */}
                <line x1="340" y1="244" x2="476" y2="244" stroke="#e2e8f0" strokeWidth="1.5" />
            </g>

            {/* ═══════════════════════════════════════
                FLOATING BADGE — "24 orders"
            ═══════════════════════════════════════ */}
            <g>
                <rect x="338" y="278" width="132" height="44" rx="12" fill="white" opacity="0.92" filter="url(#softShadow)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="4s"
                        begin="0.4s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
                <circle cx="360" cy="300" r="12" fill="#f97316" opacity="0.15">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="4s"
                        begin="0.4s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </circle>
                {/* truck icon simplified */}
                <rect x="352" y="295" width="16" height="10" rx="2" fill="#f97316">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="4s"
                        begin="0.4s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
                <text x="380" y="296" fontSize="10" fontWeight="600" fill="#64748b" fontFamily="system-ui">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="4s"
                        begin="0.4s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                    Orders Today
                </text>
                <text x="380" y="310" fontSize="13" fontWeight="700" fill="#f97316" fontFamily="system-ui">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-5; 0,0"
                        dur="4s"
                        begin="0.4s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                    24 Shipped
                </text>
            </g>

            {/* ═══════════════════════════════════════
                FLOATING BADGE — stock status
            ═══════════════════════════════════════ */}
            <g>
                <rect x="338" y="340" width="132" height="44" rx="12" fill="white" opacity="0.92" filter="url(#softShadow)">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-6; 0,0"
                        dur="3.5s"
                        begin="1s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </rect>
                <circle cx="355" cy="362" r="6" fill="#22c55e">
                    <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-6; 0,0"
                        dur="3.5s"
                        begin="1s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                </circle>
                <text x="368" y="358" fontSize="10" fontWeight="600" fill="#64748b" fontFamily="system-ui">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-6; 0,0"
                        dur="3.5s"
                        begin="1s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                    Stock Status
                </text>
                <text x="368" y="372" fontSize="13" fontWeight="700" fill="#1e293b" fontFamily="system-ui">
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,-6; 0,0"
                        dur="3.5s"
                        begin="1s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                    />
                    128 Items OK
                </text>
            </g>

            {/* ═══════════════════════════════════════
                ANIMATED DOTTED FLOW PATH
            ═══════════════════════════════════════ */}
            <path
                d="M 300 180 C 320 180, 330 240, 340 260"
                stroke="url(#arrowGrad)"
                strokeWidth="2"
                strokeDasharray="5 4"
                fill="none"
                opacity="0.6"
            >
                <animate attributeName="strokeDashoffset" values="0;-54" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path
                d="M 300 310 C 322 310, 332 295, 340 292"
                stroke="url(#arrowGrad)"
                strokeWidth="2"
                strokeDasharray="5 4"
                fill="none"
                opacity="0.6"
            >
                <animate attributeName="strokeDashoffset" values="0;-54" dur="1.8s" repeatCount="indefinite" />
            </path>

            {/* ═══════════════════════════════════════
                SPARKLE DOTS
            ═══════════════════════════════════════ */}
            <circle cx="72" cy="118" r="4" fill="#f97316" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="450" cy="128" r="3" fill="#fbbf24" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.8s" begin="0.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="310" cy="420" r="5" fill="#f97316" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="3s" begin="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="68" cy="390" r="3" fill="#fb923c" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.15;0.6" dur="3.4s" begin="0.8s" repeatCount="indefinite" />
            </circle>
        </svg>
    )
}
