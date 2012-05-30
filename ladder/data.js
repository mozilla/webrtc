var data = {
    participants : [
        ["AJS","Alice JS"],
        ["AB", "Alice Browser"],
        ["BB", "Bob Browser"],
        ["BJS", "Bob JS"]
    ],
    
    data : [
        [ARROW, "AJS", "AB", "pc = new PeerConnection()"],
        [ARROW, "AB", "AJS", "onicechange('gathering')"],
        [ARROW, "BB", "BJS", "TEST", {
             duration:2,
             advance:0
         }
        ],
        [ARROW, "BJS", "BB", "TEST2", {
             duration:2,
         }
        ],
        [DARROW, "BB", "AB", "More"],
    ]
};
