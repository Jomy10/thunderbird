use crate::colors::*;
use rust_api::*;

pub enum Sprite {
    Player,
    Enemy
}

impl<'a> Sprite {
    const PLAYER_SPRITE: &'a [DrawInstruction] = &[
        DrawInstruction::Rect(6, 2, 4, 2, BLUE),
        DrawInstruction::Point(5, 3, BLUE),
        DrawInstruction::Point(10, 3, BLUE),
        DrawInstruction::Rect(4, 4, 8, 3, BLUE),
        DrawInstruction::Rect(7, 4, 2, 2, YELLOW),
        DrawInstruction::Rect(3, 6, 10, 7, BLUE),
        DrawInstruction::Rect(12, 9, 3, 6, BLUE),
        DrawInstruction::Rect(1, 9, 3, 6, BLUE),
        DrawInstruction::Point(4, 13, BLUE),
        DrawInstruction::Point(11, 13, BLUE),
        DrawInstruction::Point(2, 8, DARK_BLUE),
        DrawInstruction::Point(13, 8, DARK_BLUE),
        DrawInstruction::Rect(1, 9, 1, 6, DARK_BLUE),
        DrawInstruction::Rect(14, 9, 1, 6, DARK_BLUE),
        DrawInstruction::Rect(3, 10, 1, 3, DARK_BLUE),
        DrawInstruction::Rect(4, 7, 1, 5, DARK_BLUE),
        DrawInstruction::Rect(11, 7, 1, 5, DARK_BLUE),
        DrawInstruction::Rect(6, 7, 1, 5, DARK_BLUE),
        DrawInstruction::Rect(9, 7, 1, 5, DARK_BLUE),
        DrawInstruction::Rect(7, 8, 2, 1, DARK_BLUE),
        DrawInstruction::Rect(7, 10, 2, 1, DARK_BLUE),
    ];
    
    const ENEMY_SPRITE: &'a [DrawInstruction] = &[
        DrawInstruction::Rect(3, 9, 10, 4, RED),
        DrawInstruction::Rect(3, 12, 1, 2, ORANGE),
        DrawInstruction::Rect(12, 12, 1, 2, ORANGE),
        DrawInstruction::Rect(4, 14, 3, 1, ORANGE),
        DrawInstruction::Rect(9, 14, 3, 1, ORANGE),
        DrawInstruction::Rect(4, 8, 8, 1, ORANGE),
        DrawInstruction::Point(5, 8, RED),
        DrawInstruction::Point(10, 8, RED),
        DrawInstruction::Point(5, 7, RED),
        DrawInstruction::Point(4, 6, RED),
        DrawInstruction::Point(10, 7, RED),
        DrawInstruction::Point(11, 6, RED),
        DrawInstruction::Rect(2, 10, 1, 2, ORANGE),
        DrawInstruction::Rect(13, 10, 1, 2, ORANGE),
        DrawInstruction::Rect(1, 11, 1, 3, ORANGE),
        DrawInstruction::Rect(14, 11, 1, 3, ORANGE),
        DrawInstruction::Point(4, 10, WHITE),
        DrawInstruction::Point(11, 10, WHITE),
    ];

    fn get_sprite(&self) -> &[DrawInstruction] {
        match self {
            Self::Player => return &Self::PLAYER_SPRITE,
            Self::Enemy => return &Self::ENEMY_SPRITE,
        }
    }
    
    pub fn render(&self, p_x: u8, p_y: u8) {
        for instr in self.get_sprite() {
            match *instr {
                DrawInstruction::Rect(x, y, w, h, c) => {
                    draw_rect(x + p_x, p_y + y, w, h, c).unwrap();
                },
                DrawInstruction::Point(x, y, c) => {
                    draw(x + p_x, y + p_y, c).unwrap();
                }
            }
        }
    }
}

enum DrawInstruction {
    // x, y, w, h, c
    Rect(u8, u8, u8, u8, u8),
    // x, y, c
    Point(u8, u8, u8)
}
