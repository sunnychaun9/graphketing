import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { Theme } from '../utils/theme';

interface AddModalProps {
  visible: boolean;
  title: string;
  placeholder: string;
  theme: Theme;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export const AddModal: React.FC<AddModalProps> = ({
  visible,
  title,
  placeholder,
  theme,
  onClose,
  onSubmit,
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
      onClose();
    }
  };

  const handleClose = () => {
    setValue('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1}>
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.backdrop} />
        </TouchableOpacity>

        <Animated.View
          entering={SlideInDown.springify().damping(15)}
          style={[styles.modal, { backgroundColor: theme.surface }]}
        >
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.background,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={theme.textSecondary}
            value={value}
            onChangeText={setValue}
            autoFocus
            onSubmitEditing={handleSubmit}
          />

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.border }]}
              onPress={handleClose}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Add</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
