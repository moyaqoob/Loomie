import z from "zod";

export const SignupSchema = z.object({
  username: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  type: z.enum(["admin", "user"]),
});

export const SigninSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const UpdateMetadataSchema = z.object({
  avatarId: z.string(),
});

export const CreateSpaceSchema = z.object({
  name: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,3}x[0-9]{1,3}$/),
  mapId: z.string().optional(),
});


export const AddElementSchema = z.object({
  elementId: z.string(),
  spaceId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const DeleteElementSchema = z.object({
  id: z.string(),
});

export const CreateElementSchema = z.object({
  imageUrl: z.string(),
  width: z.number(),
  height: z.number(),
  static: z.boolean(),
});

export const UpdateElementSchema = z.object({
  imageUrl: z.string(),
});

export const CreateAvatarSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
});

export const CreateMapSchema = z.object({
  name: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  thumbnail: z.string(),
  mapElements: z.array(
    z.object({
      elementId: z.string(),
      x: z.number(),
      y: z.number(),
    })
  ),
});
